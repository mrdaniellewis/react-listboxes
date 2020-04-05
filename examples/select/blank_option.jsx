import React, { useState } from 'react';
import { Select } from '../../src/index.js';

const options = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Ugli fruit',
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
        blank="Please choose…"
        value={value}
        onValue={setValue}
        options={options}
      />
    </>
  );
}
