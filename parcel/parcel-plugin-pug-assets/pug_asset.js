const path = require('path');
const Asset = require('parcel-bundler/src/Asset');
const localRequire = require('parcel-bundler/src/utils/localRequire');

class PugAsset extends Asset {
  constructor(name, options) {
    super(name, options);
    this.type = 'html';
  }

  async generate() {
    const pug = await localRequire('pug', this.name);
    const config = (await this.getConfig(['.pugrc', '.pugrc.js', 'pug.config.js'])) || {};

    const compiled = pug.compile(this.contents, {
      compileDebug: false,
      filename: this.name,
      basedir: config.basedir || path.dirname(this.name),
      pretty: !this.options.minify,
      templateName: path.basename(this.basename, path.extname(this.basename)),
      filters: config.filters,
      filterOptions: config.filterOptions,
      filterAliases: config.filterAliases,
    });

    if (compiled.dependencies) {
      for (const item of compiled.dependencies) { // eslint-disable-line no-restricted-syntax
        this.addDependency(item, {
          includedInParent: true,
        });
      }
    }

    return compiled();
  }
}

module.exports = PugAsset;
