const render = require('posthtml-render');

const sub = {
  '<': '&lt;',
  '&': '&amp;',
};

module.exports = function posthtmlEscapeCode() {
  return function escapeCode(tree) {
    return tree.match({ tag: 'code' }, (node) => {
      node.content = render(node.content).replace(/[<&]/g, (m) => sub[m]); // eslint-disable-line no-param-reassign
      return node;
    });
  };
};
