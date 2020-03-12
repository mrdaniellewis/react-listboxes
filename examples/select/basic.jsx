import React, { useState } from 'react';
import { Select } from '../../src/components/select.jsx';
import countries from '../lib/countries.json';

export function BasicSelect() {
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
        options={countries}
      />
    </>
  );
}
