import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { tokenHighlighter } from '../../highlighters/token_highlighter.js';

export function TokenHighlight(props) {
  return (
    <HighlightValue
      highlight={tokenHighlighter}
      {...props}
    />
  );
}
