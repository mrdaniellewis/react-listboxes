import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box.jsx';
import { unindent } from './lib/unindent.js';
import { useId } from './lib/use_id.js';
import countries from './lib/countries.json';
import { useTokenSearch } from '../src/hooks/use_token_search.js';
import { useSearch } from '../src/hooks/use_search.js';
import { tokenSearcher } from '../src/searchers/token_searcher.js';

function ComboBoxField({ label, options: originalOptions, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch] = useTokenSearch(originalOptions);
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

function AsyncComboBoxField({ label, options: originalOptions, ...props }) {
  const [value, setValue] = useState(null);
  const [search] = useState(() => {
    const fn = tokenSearcher(originalOptions);
    return async (query) => {
      await new Promise((resolve) => {
        setTimeout(resolve, Math.random() * 5000);
      });
      return fn(query);
    };
  });
  const [options, onSearch, busy] = useSearch(search, { initialOptions: originalOptions });
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

AsyncComboBoxField.propTypes = {
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
        autoselect
      />
      <ComboBoxField
        label="Inline autocomplete"
        options={countries}
        autoselect="inline"
      />
      <ComboBoxField
        label="Inline tab autocomplete"
        options={countries}
        autoselect="inline"
        tabAutocomplete
      />
      <ComboBoxField
        label="Inline tab autocomplete without managed focus"
        options={countries}
        autoselect="inline"
        tabAutocomplete
        managedFocus={false}
      />
      <ComboBoxField
        label="Inline autocomplete without managed focus"
        options={countries}
        autoselect="inline"
        managedFocus={false}
      />
      <ComboBoxField
        label="Inline autocomplete without managed focus or showing selected label"
        options={countries}
        autoselect="inline"
        managedFocus={false}
        showSelectedLabel={false}
      />
      <AsyncComboBoxField
        label="Async search"
        options={countries}
        autoselect="inline"
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
