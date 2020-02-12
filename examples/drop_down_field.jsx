import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { DropDown } from '../src/components/drop_down.jsx';
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
      <div className="dropdown">
        <DropDown
          id={id}
          {...props}
          value={value}
          setValue={(newValue) => setValue(newValue)}
          ButtonComponent={{ 'aria-labelledby': `${id}_label ${id}` }}
        />
      </div>
    </>
  );
}

DropDownField.propTypes = {
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
};

DropDownField.defaultProps = {
  value: null,
};
