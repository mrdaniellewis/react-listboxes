import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

export function Highlight({ children }) {
  const parts = children.map((part) => (Array.isArray(part) ? <mark>{part}</mark> : part));
  return React.createElement(Fragment, null, ...parts);
}

Highlight.propTypes = {
  children: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ])).isRequired,
};
