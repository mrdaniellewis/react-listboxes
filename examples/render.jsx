import React from 'react';;
import ReactDOM from 'react-dom';
import * as components from '**/*.jsx';

document.querySelectorAll('[data-example]').forEach((node) => {
  const parts = node.dataset.example.split('/');
  let target = components;
  parts.forEach((part) => {
    target = target[part];
  });

  ReactDOM.render(
    <target.Example />,
    node,
  );
});
