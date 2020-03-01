import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { passThroughHighlighter } from '../../highlighters/pass_through_highlighter.js';

export function PassThroughHighlight(props) {
  return (
    <HighlightValue
      highlight={passThroughHighlighter}
      {...props}
    />
  );
}
