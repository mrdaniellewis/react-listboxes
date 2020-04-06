import React, { useRef, useState } from 'react';
import { DropDown } from '../../../src/index.js';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
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
