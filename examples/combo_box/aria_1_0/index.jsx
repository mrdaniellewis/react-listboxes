import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox, useTokenSearch } from '../../../src/index.js';

const options = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Ugli fruit',
];

const InputComponent = forwardRef(({ 'aria-controls': ariaOwns, ...props }, ref) => (
  <input
    {...props}
    ref={ref}
    aria-owns={ariaOwns}
  />
));

InputComponent.propTypes = {
  'aria-controls': PropTypes.string.isRequired,
};

InputComponent.displayName = 'InputComponent';

export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch] = useTokenSearch(options);

  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <ComboBox
        id="select"
        value={value}
        onValue={setValue}
        onSearch={onSearch}
        options={filteredOptions}
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
