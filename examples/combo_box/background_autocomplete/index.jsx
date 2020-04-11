import React, { forwardRef, useContext, useState } from 'react';
import { ComboBox, useSearch, Context } from '../../../src/index.js';

function search(value) {
  if (!value) {
    return [];
  }

  const match = value.match(/^.*\b(in|is|from|to):(\w*)$/);
  if (!match) {
    return [];
  }

  const found = {
    in: ['spam', 'bin', 'inbox', 'draft'],
    is: ['read', 'starred'],
    from: ['me', 'example@foo.com'],
    to: ['me', 'example@bar.com'],
  }[match[1]];

  if (!found) {
    return [];
  }

  return found
    .filter((term) => (
      (!match[2] || term.startsWith(match[2].toLowerCase())) && !new RegExp(`\\b${match[1]}:${term}\\b`).test(value)
    ))
    .map((term) => (
      `${value}${term.slice((match[2] || '').length)} `
    ));
}

const InputComponent = forwardRef((props, ref) => {
  const { state: { expanded, suggestedOption } } = useContext(Context);
  const suggestedValue = (expanded && suggestedOption?.label) || '';

  return (
    <>
      <input
        {...props}
        ref={ref}
        style={{ background: 'transparent' }}
      />
      <input
        {...props}
        value={suggestedValue}
        disabled
        id={null}
        style={{ position: 'absolute', left: 0, background: 'white', zIndex: -1 }}
      />
    </>
  );
});

InputComponent.displayName = 'InputComponent';

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useSearch(search, { minLength: 1 });

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        size={100}
        onChange={({ target: { value: _value } }) => setValue(_value)}
        onSearch={onSearch}
        options={filteredOptions}
        tabAutocomplete
        showSelectedLabel
        searchOnFocus={false}
        managedFocus={false}
        NotFoundComponent={() => null}
        ClearButtonComponent={() => null}
        InputComponent={InputComponent}
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
