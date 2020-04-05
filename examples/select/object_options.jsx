import React, { useState } from 'react';
import { Select } from '../../src/index.js';

const options = [
  { id: 1, label: 'Apple' },
  { id: 2, label: 'Banana' },
  { id: 3, label: 'Cherry' },
  { id: 4, label: 'Mango' },
  { id: 5, label: 'Ugli fruit' },
];

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="basic-select">
        Basic select
      </label>
      <Select
        id="basic-select"
        value={value}
        onValue={setValue}
        options={options}
      />
    </>
  );
}
