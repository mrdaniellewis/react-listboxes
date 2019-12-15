import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box.jsx';
import { unindent } from './lib/unindent.js';
import { useId } from '../src/hooks/use_id.js';
import countries from './lib/countries.json';
import { useSearch } from '../src/hooks/use_search.js';

function ComboBoxField({ label, options: originalOptions, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch] = useSearch(originalOptions);
  const id = useId();
  return (
    <>
      <label
        htmlFor={id}
      >
        {label}
      </label>
      <ComboBox
        autoSelect
        id={id}
        value={value}
        setValue={setValue}
        options={options}
        onSearch={onSearch}
        {...props}
      />
    </>
  );
}

ComboBoxField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

function Example() {
  return (
    <>
      <pre>
        <code className="language-js">
          {unindent`
            const [value, setValue] = useState();
            const [options, onSearch] = useSearch([
              'Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit',
            ]);

            <ComboBox
              value={value}
              setValue={setValue}
              onSearch={onSearch}
              options={options}
            />
          `}
        </code>
      </pre>
      <ComboBoxField
        label="Select"
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

            <ComboBox
              value={value}
              setValue={setValue}
              options={options}
            />
          `}
        </code>
      </pre>
      <ComboBoxField
        label="With a disabled option"
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

            <ComboBox
              value={value}
              setValue={setValue}
              options={options}
            />
          `}
        </code>
      </pre>
      <ComboBoxField
        label="Grouped options"
        options={[
          { label: 'Apple' },
          { label: 'Orange', group: 'Citrus' },
          { label: 'Lemon', group: 'Citrus' },
          { label: 'Raspberry', group: 'Berry' },
          { label: 'Strawberry', group: 'Berry' },
        ]}
      />
      <ComboBoxField
        label="Large number of options"
        options={countries}
      />
      <ComboBoxField
        label="Extremely long options"
        options={[
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
          'Short',
          'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
          'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
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
