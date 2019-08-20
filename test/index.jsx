import React from 'react';
import ReactDOM from 'react-dom';
import { Examples } from './examples.jsx';

const container = document.getElementById('root');
document.body.appendChild(container);
ReactDOM.render(
  <Examples />,
  container,
);
