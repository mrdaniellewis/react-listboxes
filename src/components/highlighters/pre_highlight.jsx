import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { preHighlighter } from '../../highlighters/pre_highlighter.js';

export function PreHighlight(props) {
  return (
    <HighlightValue
      highlight={preHighlighter}
      {...props}
    />
  );
}
