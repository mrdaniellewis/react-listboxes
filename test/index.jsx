import React from 'react';
import ReactDOM from 'react-dom';
import { Examples } from './examples.jsx';

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(
  <Examples />,
  container,
);
