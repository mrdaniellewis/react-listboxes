import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down.jsx';
import { unindent } from './lib/unindent.js';
import { useId } from './lib/use_id.js';
import countries from './lib/countries.json';

function DropDownField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = useId();
  return (
    <>
      <span
        id={`${id}_label`}
        // This simulates the action of clicking on a label
        onClick={() => document.getElementById(id).focus()}
      >
        {label}
      </span>
      <DropDown
        id={id}
        value={value}
        onValue={setValue}
        aria-labelledby={`${id}_label ${id}`}
        {...props}
      />
    </>
  );
}

DropDownField.propTypes = {
  label: PropTypes.string.isRequired,
};

function Example() {
  return (
    <>
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();

            <DropDown
              value={value}
              setValue={setValue}
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <DropDownField
        label="Select"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();

            <DropDown
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <DropDownField
        label="Select with blank"
        blank="Please choose…"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();
            const options = [
              { label: 'Apple' },
              { label: 'Banana' },
              { label: 'Orange', disabled: true },
            ]

            <DropDown
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={options}
            />
          `}
        </code>
      </pre>
      <DropDownField
        label="With a disabled option"
        blank="Please choose…"
        options={[
          { label: 'Apple' },
          { label: 'Banana' },
          { label: 'Orange', disabled: true },
        ]}
      />
      <DropDownField
        label="With first option disabled"
        options={[
          { label: 'Apple', disabled: true },
          { label: 'Banana' },
          { label: 'Orange' },
        ]}
      />
      <DropDownField
        label="With all options disabled"
        options={[
          { label: 'Apple', disabled: true },
          { label: 'Banana', disabled: true },
          { label: 'Orange', disabled: true },
        ]}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();
            const options = [
              { label: 'Apple' },
              { label: 'Orange', group: 'Citrus' },
              { label: 'Lemon', group: 'Citrus' },
              { label: 'Raspberry', group: 'Berry' },
              { label: 'Strawberry', group: 'Berry' },
            ]

            <DropDown
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={options}
            />
          `}
        </code>
      </pre>
      <DropDownField
        label="Grouped options"
        blank="Please choose…"
        options={[
          { label: 'Apple' },
          { label: 'Orange', group: 'Citrus' },
          { label: 'Lemon', group: 'Citrus' },
          { label: 'Raspberry', group: 'Berry' },
          { label: 'Strawberry', group: 'Berry' },
        ]}
      />
      <DropDownField
        label="Large number of options"
        blank="Please choose…"
        options={countries}
      />
      <DropDownField
        label="Large number of options - without managed focus"
        blank="Please choose…"
        options={countries}
        managedFocus={false}
      />
      <DropDownField
        label="Extremely long options"
        blank="Please choose..."
        options={[
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          'Short',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        ]}
      />
      <DropDownField
        label="Disabled"
        blank="Please choose…"
        options={countries}
        disabled
      />
      <DropDownField
        label="No options"
        options={[]}
      />
      <DropDownField
        label="All options disabled"
        options={[
          { label: 'Apple', disabled: true },
          { label: 'Orange', disabled: true },
          { label: 'Lemon', disabled: true },
        ]}
      />
      <DropDownField
        label="First option disabled"
        options={[
          { label: 'Apple', disabled: true },
          { label: 'Orange' },
          { label: 'Lemon' },
        ]}
      />
    </>
  );
}

const container = document.createElement('div');
document.currentScript.after(container);
ReactDOM.render(
  <Example />,
  container,
);
