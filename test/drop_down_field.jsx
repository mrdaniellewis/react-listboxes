import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down/index.jsx';

export function DropDownField({ label, ...props }) {
  const { value: initialValue } = props;
  const [value, setValue] = useState(initialValue);
  const id = label.trim().replace(/[^a-z]{2,}/, '_');
  return (
    <>
      <span id={`label_${id}`}>
        {label}
      </span>
      <DropDown
        id={id}
        aria-labelledby={`label_${id} ${id}`}
        {...props}
        value={value}
        setValue={newValue => setValue(newValue)}
      />
    </>
  );
}

DropDownField.propTypes = {
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
};

DropDownField.defaultProps = {
  value: null,
};
