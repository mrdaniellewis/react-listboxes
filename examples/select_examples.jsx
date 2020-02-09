import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Select } from '../src/components/select.jsx';
import { unindent } from './lib/unindent.js';
import countries from './lib/countries.json';

function SelectField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = label.trim().toLowerCase().replace(/[^a-z]+/ig, '_').toLowerCase();
  return (
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <div className="select">
        <Select
          id={id}
          value={value}
          onValue={setValue}
          {...props}
        />
      </div>
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
};

function Example() {
  return (
    <>
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();

            <Select
              value={value}
              setValue={setValue}
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <SelectField
        label="Select"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();

            <Select
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <SelectField
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

            <Select
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={options}
            />
          `}
        </code>
      </pre>
      <SelectField
        label="With a disabled option"
        blank="Please choose…"
        options={[
          { label: 'Apple' },
          { label: 'Banana' },
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

            <Select
              value={value}
              setValue={setValue}
              blank="Please choose…"
              options={options}
            />
          `}
        </code>
      </pre>
      <SelectField
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
      <SelectField
        label="Very long list"
        blank="Please choose…"
        options={countries}
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
