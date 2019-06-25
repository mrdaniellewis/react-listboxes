import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down/index.jsx';

export function DropDownField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = label.trim().replace(/[^a-z]{2,}/, '_');
  return (
    <>
      <span id={`label_${id}`}>
        {label}
      </span>
      <DropDown
        id={id}
        aria-labelledby={`label_${id}`}
        value={value}
        setValue={newValue => setValue(newValue)}
        {...props}
      />
    </>
  );
}

DropDownField.propTypes = {
  label: PropTypes.string.isRequired,
};
