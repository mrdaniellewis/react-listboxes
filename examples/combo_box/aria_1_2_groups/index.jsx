import React, { useContext, useState } from 'react';
import { Context, ComboBox, useTokenSearch } from '../../../src/index.js';

const options = [
  { label: 'Apple' },
  { label: 'Orange', group: 'Citrus' },
  { label: 'Lemon', group: 'Citrus' },
  { label: 'Raspberry', group: 'Berry' },
  { label: 'Strawberry', group: 'Berry' },
];

function GroupComponent({ children }) {
  const { group: { key } } = useContext(Context);
  const [label, groupOptions] = children;

  return (
    <li
      role="group"
      aria-labelledby={key}
    >
      {label}
      <ul
        role="presentation"
        className="react-combo-boxes-listbox__group"
      >
        {groupOptions}
      </ul>
    </li>
  );
}

function GroupLabelComponent({ children }) {
  const { group: { key } } = useContext(Context);

  return (
    <div
      className="react-combo-boxes-listbox__group-label"
      id={key}
    >
      {children}
    </div>
  );
}

export function Example() {
  const [value, setValue] = useState(null);
  const [managedFocus, setManagedFocus] = useState(true);
  const [filteredOptions, onSearch] = useTokenSearch(options);

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
        managedFocus={managedFocus}
        GroupComponent={GroupComponent}
        GroupLabelComponent={GroupLabelComponent}
        VisuallyHiddenComponent={() => null} // hidden group label not required
      />

      <label>
        <input
          type="checkbox"
          onChange={({ target: { checked } }) => setManagedFocus(checked)}
          checked={managedFocus}
        />
        {' '}
        Toggle managed focus
      </label>

      <label htmlFor="output">
        Current value
      </label>
      <output htmlFor="select" id="output">
        {JSON.stringify(value, undefined, ' ')}
      </output>
    </>
  );
}