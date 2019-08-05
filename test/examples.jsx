/* eslint-disable no-console */

import React from 'react';
import { SelectField } from './select_field.jsx';
import { DropDownField } from './drop_down_field.jsx';
import { ComboBoxField } from './combo_box_field.jsx';
import { AsyncComboBoxField } from './async_combo_box_field.jsx';
import { Menu } from '../src/components/menu.jsx';
import { NavigationMenu } from '../src/components/navigation_menu.jsx';

export function Examples() {
  return (
    <>
      <h1>Examples</h1>
      <h2>Select</h2>
      <SelectField
        label="Numbers"
        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      />
      <SelectField
        label="Strings"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
      />
      <SelectField
        label="Arrays"
        options={[['foo', 'Foo'], ['bar', 'Bar'], ['foe', 'Foe'], ['fee', 'Fee']]}
      />
      <SelectField
        label="Objects"
        options={[
          {
            label: 'Foo',
            value: 1,
          },
          {
            label: 'Boo',
            value: 2,
            disabled: true,
          },
          {
            label: 'Foe',
            value: 3,
          },
        ]}
      />
      <SelectField
        label="Grouped objects"
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
        ]}
      />
      <SelectField
        label="With blank"
        blank="Please choose..."
        options={[
          1,
          'Foo',
          ['bar', 'Bar'],
          { label: 'Foe', value: 'foe' },
        ]}
      />
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
      <div>
        <Menu
          options={[
            {
              label: 'Foo',
              value: 1,
              onClick: () => console.log(1),
            },
            {
              label: 'Boo',
              value: 2,
              disabled: true,
              onClick: () => console.log(2),
            },
            {
              label: 'Foe',
              value: 3,
              group: 'Two',
              onClick: () => console.log(3),
            },
            {
              label: 'Thumb',
              value: 4,
              group: 'Two',
              onClick: () => console.log(4),
            },
          ]}
          id="menu"
        >
          Menu
        </Menu>
      </div>
      <div>
        <NavigationMenu
          options={[
            {
              label: 'Example.com',
              value: 1,
              href: 'http://example.com',
            },
            {
              label: 'bbc.co.uk',
              value: 2,
              href: 'http://bbc.co.uk',
            },
            {
              label: 'wikipedia.org',
              value: 3,
              href: 'http://wikipedia.org',
            },
          ]}
          id="navigation_menu"
        >
          Navigation menu
        </NavigationMenu>
      </div>
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
