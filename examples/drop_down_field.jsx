import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down/index.jsx';
import { useId } from '../src/hooks/use_id.js';

export function DropDownField({ label, ...props }) {
  const { value: initialValue } = props;
  const [value, setValue] = useState(initialValue);
  const id = useId();
  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label id={`${id}_label`} onClick={() => document.getElementById(id).focus()}>
        {label}
      </label>
      <DropDown
        id={id}
        {...props}
        value={value}
        setValue={(newValue) => setValue(newValue)}
        ButtonComponent={{ 'aria-labelledby': `${id}_label ${id}` }}
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
