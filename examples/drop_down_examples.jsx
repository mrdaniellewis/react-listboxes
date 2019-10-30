import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down/index.jsx';
import { unindent } from './lib/unindent.js';
import { useId } from '../src/hooks/use_id.js';
import countries from './lib/countries.json';

function DropDownField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = useId();
  return (
    <>
      <span
        id={`${id}_label`}
        onClick={() => document.getElementById(id).focus()}
      >
        {label}
      </span>
      <DropDown
        id={id}
        value={value}
        setValue={setValue}
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
    </>
  );
}

const container = document.createElement('div');
document.currentScript.after(container);
ReactDOM.render(
  <Example />,
  container,
);
