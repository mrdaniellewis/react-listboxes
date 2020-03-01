import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { emHighlighter } from '../../highlighters/em_highlighter.js';

export function EmHighlight(props) {
  return (
    <HighlightValue
      highlight={emHighlighter}
      {...props}
    />
  );
}
