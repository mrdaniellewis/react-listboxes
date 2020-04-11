import React, { forwardRef, useContext, useState } from 'react';
import { Context, ComboBox, useTokenSearch } from '../../../src/index.js';

const options = [
  'Apple',
  'Orange',
  'Lemon',
  'Raspberry',
  'Strawberry',
];

const WrapperComponent = forwardRef((props, ref) => {
  const { state: { showListBox }, props: { id } } = useContext(Context);
  return (
    <div
      {...props}
      ref={ref}
      role="combobox" // eslint-disable-line jsx-a11y/role-has-required-aria-props
      aria-owns={id}
      aris-expanded={showListBox ? 'true' : 'false'}
    />
  );
});

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);

  return (
    <>
      <label htmlFor="select" id="select-label">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onValue={setValue}
        onSearch={onSearch}
        options={filteredOptions}
        WrapperComponent={WrapperComponent}
        wrapperProps={{ 'aria-labelledby': 'select-label' }}
        inputProps={{ role: null, 'aria-expanded': null }}
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
