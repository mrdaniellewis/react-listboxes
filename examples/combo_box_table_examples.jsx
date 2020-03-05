import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { ComboBoxTable } from '../src/components/combo_box_table.jsx';
import { useId } from './lib/use_id.js';
import cats from './lib/cats.json';
import { useTokenSearch } from '../src/hooks/use_token_search.js';
import { confine } from '../src/layout_list_box/confine.js';

function index(o) {
  return o.breed;
}

function ComboBoxField({ label, options: originalOptions, ...props }) {
  const [value, setValue] = useState(null);
  const [options, onSearch] = useTokenSearch(originalOptions, { index });
  const id = useId();
  return (
    <>
      <label
        htmlFor={id}
      >
        {label}
      </label>
      <ComboBoxTable
        id={id}
        value={value}
        onValue={setValue}
        options={options}
        onSearch={onSearch}
        layoutListBox={confine()}
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
      <ComboBoxField
        label="Types of cats"
        options={cats}
        mapOption={(option) => ({
          ...option,
          label: option.breed,
        })}
        columns={['breed', 'country', 'origin', 'bodyType', 'coatLength', 'pattern']}
      />
      <ComboBoxField
        label="Types of cats with column names"
        options={cats}
        mapOption={(option) => ({
          ...option,
          label: option.breed,
        })}
        columns={[
          { name: 'breed', label: 'Breed' },
          { name: 'country', label: 'Country' },
          { name: 'origin', label: 'Origin' },
          { name: 'bodyType', label: 'Body type' },
          { name: 'coatLength', label: 'Coat length' },
          { name: 'pattern', label: 'Pattern' },
        ]}
      />
      <ComboBoxField
        label="Grouped types of cats"
        options={cats}
        mapOption={(option) => ({
          ...option,
          label: option.breed,
          group: option.bodyType,
        })}
        columns={['breed', 'country', 'origin', 'coatLength', 'pattern']}
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
