const render = require('posthtml-render');
const parser = require('posthtml-parser');
const marked = require('marked');

module.exports = function posthtmlMarkdown(options = {}) {
  return function escapeCode(tree) {
    return tree.match({ tag: 'markdown' }, (node) => {
      node.tag = false; // eslint-disable-line no-param-reassign
      const html = marked(render(node.content), options);
      node.content = parser(html); // eslint-disable-line no-param-reassign
      return node;
    });
  };
};
