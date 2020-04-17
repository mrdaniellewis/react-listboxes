import React, { useState } from 'react';
import { ComboBox, useSearch, tokenSearcher } from '../../../src/index.js';
import countries from '../../data/countries.json';

function mapOption({ name }) {
  return name;
}

const searcher = tokenSearcher(countries, { index: mapOption });

async function search(term) {
  await new Promise((resolve) => {
    setTimeout(resolve, Math.random() * 1000);
  });

  return searcher(term);
}


export function Example() {
  const [value, setValue] = useState(null);
  const [filteredOptions, onSearch, busy] = useSearch(search, { initialOptions: countries });

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
        mapOption={mapOption}
        busy={busy}
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
