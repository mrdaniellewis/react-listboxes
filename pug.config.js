const escape = require('escape-html'); // eslint-disable-line import/no-extraneous-dependencies
const { name } = require('./package.json');

module.exports = {
  rootDir: 'examples/',
  filters: {
    escape: (text) => escape(text),
    fakeInclude: (text) => text.replace('../../src/index.js', name),
  },
};
