/* eslint-disable no-console */

import React from 'react';
import { SelectField } from './select_field.jsx';
import { DropDownField } from './drop_down_field.jsx';
import { ComboBoxField } from './combo_box_field.jsx';
import { AsyncComboBoxField } from './async_combo_box_field.jsx';
import { MenuButton } from '../src/components/menu_button/index.jsx';
import { NavigationMenuButton } from '../src/components/navigation_menu_button.jsx';

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
            label: 'Not grouped',
          },
          {
            label: 'Foo',
            group: 'One',
          },
          {
            label: 'Boo',
            disabled: true,
            group: 'One',
          },
          {
            label: 'Foe',
            group: 'Two',
          },
        ]}
      />
      <SelectField
        label="Pre-grouped objects"
        options={[
          {
            label: 'Not grouped',
          },
          {
            label: 'One',
            options: [
              'Foo',
              {
                label: 'Boo',
                disabled: true,
              },
            ],
          },
          {
            label: 'Two',
            options: [
              'Foe',
            ],
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
      <div>
        <MenuButton
          options={[
            {
              label: 'Foo',
              onClick: () => console.log(1),
            },
            {
              label: 'Boo',
              disabled: true,
              onClick: () => console.log(2),
            },
            <div role="separator" />,
            {
              label: 'Foe',
              onClick: () => console.log(3),
            },
            {
              label: 'Thumb',
              onClick: () => console.log(4),
            },
            (
              <a href="http://www.citizensadvice.org.uk" tabIndex={null} role={null}>
                 www.citizensadvice.org.uk
              </a>
            ),
          ]}
          id="menu"
          openOnHover
        >
          Menu
        </MenuButton>
      </div>
      <div>
        <NavigationMenuButton
          options={[
            {
              label: 'example.com',
              href: 'http://example.com',
              tabIndex: null,
            },
            {
              label: 'bbc.co.uk',
              href: 'http://bbc.co.uk',
              tabIndex: null,
            },
            {
              label: 'bbc.co.uk',
              href: 'http://bbc.co.uk',
              tabIndex: null,
            },
            {
              label: 'wikipedia.org',
              href: 'http://wikipedia.org',
              tabIndex: null,
            },
          ]}
          id="menu"
        >
          Navigation menu
        </NavigationMenuButton>
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
