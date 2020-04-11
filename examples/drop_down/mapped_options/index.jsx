import React, { useRef, useState } from 'react';
import { DropDown } from '../../../src/index.js';
import countries from '../../countries.json';

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();

  return (
    <>
      <div
        className="label"
        onClick={() => ref.current.focus()}
        id="drop-down-label"
      >
        Drop down
      </div>
      <DropDown
        id="drop-down"
        aria-labelledby="drop-down-label"
        value={value}
        onValue={setValue}
        options={countries}
        mapOption={({ name, code }) => ({ label: `${name} (${code})` })}
      />

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="drop-down" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}
