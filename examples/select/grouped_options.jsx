import React, { useState } from 'react';
import { Select } from '../../src/index.js';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
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
