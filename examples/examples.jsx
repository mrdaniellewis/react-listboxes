/* eslint-disable no-console */

import React from 'react';
import { DropDownField } from './drop_down_field.jsx';
import { ComboBoxField } from './combo_box_field.jsx';
import { AsyncComboBoxField } from './async_combo_box_field.jsx';

export function Examples() {
  return (
    <>
      <h1>Examples</h1>
      <h2>Drop down</h2>
      <DropDownField
        label="Dropdown"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
        value="Foo"
      />
      <DropDownField
        label="Dropdown with blank"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
        blank="Please choose…"
      />
      <DropDownField
        label="Dropdown windows style"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
        blank="Please choose…"
        platform="windows"
      />
      <DropDownField
        label="Dropdown more Maccy"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
        blank="Please choose…"
        platform="mac"
      />
      <DropDownField
        label="Dropdown grouped"
        value={1}
        options={[
          {
            label: 'Foo',
            value: 1,
            group: 'One',
          },
          {
            label: 'Boo',
            value: 2,
            disabled: true,
            group: 'One',
          },
          {
            label: 'Foe',
            value: 3,
            group: 'Two',
          },
          {
            label: 'Thumb',
            value: 4,
            group: 'Two',
          },
        ]}
      />
      <DropDownField
        label="Extremely long options"
        blank="Please choose..."
        options={[
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ]}
      />
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label htmlFor="native-combobox">
        Native combobox
      </label>
      <input type="text" list="combolist" id="native-combobox" />
      <datalist id="combolist">
        <option value="foo" />
        <option value="foe" />
        <option value="bar" />
        <option value="thumb" />
      </datalist>
      <ComboBoxField
        label="ComboBox"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
      />
      <ComboBoxField
        label="ComboBox grouped"
        options={[
          {
            label: 'Foo',
            value: 1,
            group: 'One',
          },
          {
            label: 'Boo',
            value: 2,
            disabled: true,
            group: 'One',
          },
          {
            label: 'Foe',
            value: 3,
            group: 'Two',
          },
          {
            label: 'Thumb',
            value: 4,
            group: 'Two',
          },
        ]}
      />
      <AsyncComboBoxField
        label="Async comboBox"
      />
    </>
  );
}