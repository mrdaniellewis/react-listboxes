import React, { useState } from 'react';
import { Select } from '../../../src/index.js';
import countries from '../../countries.json';

export function Example() {
  const [value, setValue] = useState(null);
  return (
    <>
      <label htmlFor="select">
        Select
      </label>
      <Select
        id="select"
        value={value}
        onValue={setValue}
        options={countries}
        mapOption={({ name, code }) => ({ label: `${name} (${code})` })}
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
