import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '../src/components/select.jsx';

export function SelectField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = label.trim().replace(/[^a-z]{2,}/, '_');
  return (
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <Select
        id={id}
        value={value}
        setValue={newValue => setValue(newValue)}
        {...props}
      />
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
};
