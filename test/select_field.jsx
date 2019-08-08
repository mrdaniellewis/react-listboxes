import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Select } from '../src/components/select.jsx';

export function SelectField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = label.trim().toLowerCase().replace(/[^a-z]+/ig, '_').toLowerCase();
  return (
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <Select
        id={id}
        value={value}
        setValue={setValue}
        {...props}
      />
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
};