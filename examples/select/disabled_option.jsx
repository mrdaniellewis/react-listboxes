import React, { useState } from 'react';
import { Select } from '../../src/components/select.jsx';

const options = [
  { label: 'Apple' },
  { label: 'Banana', disabled: true },
  { label: 'Orange' },
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="disabled-select">
        Select with disabled option
      </label>
      <Select
        id="disabled-select"
        value={value}
        onValue={setValue}
        options={options}
      />
    </>
  );
}
