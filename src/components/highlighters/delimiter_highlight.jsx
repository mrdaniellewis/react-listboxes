import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { delimiterHighlighter } from '../../highlighters/delimiter_highlighter.js';

export function DelimiterHighlight(props) {
  return (
    <HighlightValue
      highlight={delimiterHighlighter}
      {...props}
    />
  );
}
