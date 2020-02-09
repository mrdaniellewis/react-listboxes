import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box.jsx';
import { unindent } from './lib/unindent.js';
import { useId } from '../src/hooks/use_id.js';
import countries from './lib/countries.json';
import { useSearch } from '../src/hooks/use_search.js';
import { useAsyncSearch } from '../src/hooks/use_async_search.js';

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
        id={id}
        value={value}
        onValue={setValue}
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


function AyncComboBoxField({ label, options: originalOptions, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch, busy] = useAsyncSearch(originalOptions);
  const id = useId();
  return (
    <>
      <label
        htmlFor={id}
      >
        {label}
      </label>
      <ComboBox
        id={id}
        value={value}
        onValue={setValue}
        options={options}
        onSearch={onSearch}
        busy={busy}
        {...props}
      />
    </>
  );
}

AyncComboBoxField.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

function Example() {
  return (
    <>
      <pre>
        <code className="language-js">
          {unindent`
            const [value, onValue] = useState();
            const [options, onSearch] = useSearch([
              'Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit',
            ]);

            <ComboBox
              value={value}
              onValue={onValue}
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
      <ComboBoxField
        label="Select without managed focus"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
        managedFocus={false}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, onValue] = useState();
            const options = [
              { label: 'Apple' },
              { label: 'Banana' },
              { label: 'Orange', disabled: true },
            ]

            <ComboBox
              value={value}
              onValue={onValue}
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
      <ComboBoxField
        label="With a disabled option and showing the selected label"
        showSelectedLabel
        options={[
          { label: 'Apple' },
          { label: 'Banana' },
          { label: 'Orange', disabled: true },
        ]}
      />
      <pre>
        <code className="language-js">
          {unindent`
            const [value, onValue] = useState();
            const options = [
              { label: 'Apple' },
              { label: 'Orange', group: 'Citrus' },
              { label: 'Lemon', group: 'Citrus' },
              { label: 'Raspberry', group: 'Berry' },
              { label: 'Strawberry', group: 'Berry' },
            ]

            <ComboBox
              value={value}
              onValue={onValue}
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
      <ComboBoxField
        label="No autocomplete"
        options={countries}
        onSearch={null}
      />
      <ComboBoxField
        label="Autocomplete"
        options={countries}
        autoComplete
      />
      <ComboBoxField
        label="Inline autocomplete"
        options={countries}
        autoComplete="inline"
      />
      <ComboBoxField
        label="Inline tab autocomplete"
        options={countries}
        autoComplete="inline"
        tabAutoComplete
      />
      <ComboBoxField
        label="Inline autocomplete without managed focus"
        options={countries}
        autoComplete="inline"
        managedFocus={false}
      />
      <ComboBoxField
        label="Async search"
        options={countries}
        autoComplete="inline"
        managedFocus={false}
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
