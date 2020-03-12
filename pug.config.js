const escape = require('escape-html'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  rootDir: 'examples/',
  filters: {
    escape: (text) => escape(text),
  },
};
