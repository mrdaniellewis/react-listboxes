import React, { useRef, useState } from 'react';
import { DropDown, ListBoxTable, useConfine } from '../../../src/index.js';
import cats from '../../cats.json';

const columns = ['breed', 'country', 'origin', 'bodyType', 'pattern'];

function mapOption({ breed, coatLength }) {
  return { label: breed, group: coatLength };
}

function resizeElement(listbox) {
  return listbox.parentNode;
}

export function Example() {
  const [value, setValue] = useState(null);
  const ref = useRef();
  const [style, onLayoutListBox] = useConfine({ resizeElement });

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
        ref={ref}
        value={value}
        onValue={setValue}
        onLayoutListBox={onLayoutListBox}
        options={cats}
        ListBoxComponent={ListBoxTable}
        listBoxListProps={{ style }}
        columns={columns}
        mapOption={mapOption}
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
