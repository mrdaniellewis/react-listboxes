import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Select } from '../../src/components/select.jsx';
import countries from '../lib/countries.json';

function Example() {
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

ReactDOM.render(
  <Example />,
  document.getElementById('example'),
);
