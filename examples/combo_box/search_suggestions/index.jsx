import React, { useState } from 'react';
import { ComboBox, usePrefixSearch } from '../../../src/index.js';
import { SuggestionHighlight } from '../../../src/components/highlighters/suggestion_highlight.jsx';

const options = [
  'css',
  'css italic',
  'css isolation',
  'css is awesome',
  'css is awesome mug',
  'css is',
  'css is visible',
  'css is selector',
  'css is hard',
  'css isn\'t being applied',
  'css is not',
  'css is not a function',
  'css syallbus',
  'css grid',
  'cssd',
];

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = usePrefixSearch(options, { minLength: 1 });

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onChange={({ target: { value: v } }) => setValue(v)}
        onSearch={onSearch}
        options={filteredOptions}
        showSelectedLabel
        managedFocus={false}
        ValueComponent={SuggestionHighlight}
        ClearButtonComponent={() => null}
        searchOnFocus={false}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
