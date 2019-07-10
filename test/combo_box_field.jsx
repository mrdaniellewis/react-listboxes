import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box/index.jsx';
import { makeSearch } from '../src/helpers/make_search.js';
import { options as validateOptions } from '../src/validators/options.js';

export function ComboBoxField({ label, ...props }) {
  const { value: initialValue, options: initialOptions } = props;
  const [value, setValue] = useState(initialValue);
  const [search] = useState(() => makeSearch(initialOptions));
  const [options, setOptions] = useState(initialOptions);
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
        setValue={newValue => setValue(newValue)}
        onSearch={term => setOptions(search(term))}
      />
    </>
  );
}

ComboBoxField.propTypes = {
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
};

ComboBoxField.defaultProps = {
  value: null,
};
