import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { prefixHighlighter } from '../../highlighters/prefix_highlighter.js';

export function PrefixHighlight(props) {
  return (
    <HighlightValue
      highlight={prefixHighlighter}
      {...props}
    />
  );
}
