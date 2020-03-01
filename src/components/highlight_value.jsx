import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight.jsx';
import { Context } from '../context.js';

export function HighlightValue({ children: value, highlight }) {
  const context = useContext(Context);
  const { state: { search } } = context;
  return (
    <Highlight>
      {highlight(value, search, context)}
    </Highlight>
  );
}

HighlightValue.propTypes = {
  children: PropTypes.string,
  highlight: PropTypes.func.isRequired,
};

HighlightValue.defaultProps = {
  children: '',
};
