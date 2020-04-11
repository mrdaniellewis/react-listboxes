import React from 'react';
import { HighlightValue } from '../highlight_value.jsx';
import { suggestionHighlighter } from '../../highlighters/suggestion_highlighter.js';

export function SuggestionHighlight(props) {
  return (
    <HighlightValue
      highlight={suggestionHighlighter}
      {...props}
    />
  );
}
