import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Highlight } from './highlight.jsx';
import { Context } from '../context.js';

export function HighlightValue({ children: value, highlight }) {
  const state = useContext(Context);
  return (
    <Highlight>
      {highlight(value, state.search, state)}
    </Highlight>
  );
}

HighlightValue.propTypes = {
  children: PropTypes.string.isRequired,
  highlight: PropTypes.func.isRequired,
};
