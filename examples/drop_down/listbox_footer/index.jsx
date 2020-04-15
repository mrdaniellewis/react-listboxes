import React, { forwardRef, useRef, useState } from 'react';
import { DropDown } from '../../../src/index.js';

const options = [
  'Apple',
  'Banana',
  'Cherry',
  'Mango',
  'Ugli fruit',
];

const ListBoxList = forwardRef(({ hidden, className, ...props }, ref) => {
  return (
    <div
      className={className}
      hidden={hidden}
    >
      <ul
        ref={ref}
        {...props}
      />
      <div>
        <a href="https://en.wikipedia.org/wiki/Fruit">
          More about fruit
        </a>
      </div>
    </div>
  );
});

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
        ref={ref}
        id="drop-down"
        aria-labelledby="drop-down-label"
        value={value}
        onValue={setValue}
        options={options}
        ListBoxListComponent={ListBoxList}
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
