import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box/index.jsx';
import { useAsyncSearch } from '../src/hooks/use_async_search.js';
import { options as validateOptions } from '../src/validators/options.js';
import { makeSearch } from '../src/helpers/make_search.js';
import fruits from './fruits.json';

export function AsyncComboBoxField({ label, ...props }) {
  const { value: initialValue, options: initialOptions } = props;
  const [value, setValue] = useState(initialValue);
  const [search] = useState(() => makeSearch(fruits));
  const [options, onSearch] = useAsyncSearch(
    async (query) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return search(query);
    },
    initialOptions,
  );
  const id = label.trim().replace(/[^a-z]{2,}/, '_');

  return (
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <ComboBox
        id={id}
        {...props}
        options={options}
        value={value}
        setValue={setValue}
        onSearch={onSearch}
      />
    </>
  );
}

AsyncComboBoxField.propTypes = {
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
};

AsyncComboBoxField.defaultProps = {
  value: null,
};
