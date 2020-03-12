import React from 'react';;
import ReactDOM from 'react-dom';
import * as components from '**/*.jsx';

document.querySelectorAll('[data-example]').forEach((node) => {
  const parts = node.dataset.example.split('/');
  let Target = components;
  parts.forEach((part) => {
    Target = Target[part];
  });

  ReactDOM.render(
    <Target />,
    node,
  );
});
