import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box.jsx';
import { useSearch } from '../src/hooks/use_search.js';
import { options as validateOptions } from '../src/validators/options.js';
import { TokenHighlight } from '../src/components/highlighters/token_highlight.jsx';

export function ComboBoxField({ label, ...props }) {
  const { value: initialValue, options: initialOptions } = props;
  const [value, setValue] = useState(initialValue);
  const [options, onSearch] = useSearch(initialOptions);
  const id = label.trim().replace(/[^a-z]+/ig, '_').toLowerCase();

  return (
    <>
      <label htmlFor={id} id={`${id}_label`}>
        {label}
      </label>
      <ComboBox
        id={id}
        labelId={`${id}_label`}
        {...props}
        options={options}
        value={value}
        setValue={setValue}
        onSearch={onSearch}
        ValueComponent={TokenHighlight}
      />
    </>
  );
}

ComboBoxField.propTypes = {
  options: validateOptions.isRequired,
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
};

ComboBoxField.defaultProps = {
  value: null,
};
