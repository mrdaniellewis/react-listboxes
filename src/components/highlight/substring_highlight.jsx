import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { substringHighlighter } from '../../highlighters/substring_highlighter.js';

export function SubstringHighlight(props) {
  return (
    <HighlightValue
      highlight={substringHighlighter}
      {...props}
    />
  );
}
