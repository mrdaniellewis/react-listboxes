/* eslint-disable import/no-extraneous-dependencies */
const escape = require('escape-html');
const marked = require('marked');
const Prism = require('prismjs');
const { name } = require('./package.json');

module.exports = {
  rootDir: 'examples/',
  locals: {
    foo: 'bar',
  },
  filters: {
    highlight: (code) => Prism.highlight(code, Prism.languages.javascript, 'javascript'),
    escape: (text) => escape(text),
    packageInclude: (text) => text.replace(/from '(..\/)+src\/index\.js';$/mg, `from '${name}';`),
    markdown: (text) => marked(text),
  },
};
