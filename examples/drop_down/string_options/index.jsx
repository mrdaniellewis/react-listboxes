import React, { useRef, useState } from 'react';
import { DropDown } from '../../../src/index.js';

const options = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Ugli fruit',
];

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();

  return (
    <>
      <div className="label" id="example-label" onClick={() => ref.current.focus()}>
        Drop down
      </div>
      <DropDown
        aria-labelledby="example-label"
        className="dropdown"
        id="example"
        value={value}
        onValue={setValue}
        options={options}
        ref={ref}
      />
    </>
  );
}
