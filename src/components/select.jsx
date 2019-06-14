import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { optionise } from '../helpers/optionise.js';
import { useGrouped } from '../hooks/use_grouped.js';

export function Select({ blank, onChange, options: rawOptions, value, ...props }) {
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);

  const grouped = useGrouped(options);

  const selectOnChange = ({ target: { value: v } }) => {
    if (blank && v === '') {
      onChange(null);
      return;
    }
    onChange(options[+v].value);
  };

  const valueIndex = options.findIndex(option => option.value === value);

  return (
    <select
      value={valueIndex === -1 ? '' : valueIndex}
      onChange={selectOnChange}
      {...props}
    >
      {blank && (
        <option value="">
          {blank}
        </option>
      )}
      {grouped.map(({ name, children }) => {
        const optionElements = children.map(({
          index, label, key, value: optionValue, ...more
        }) => (
          <option
            value={index}
            key={key || optionValue}
            {...more}
          >
            {label}
          </option>
        ));
        if (name) {
          return (
            <optgroup label={name} key={name}>
              {optionElements}
            </optgroup>
          );
        }
        return optionElements;
      })}
    </select>
  );
}

Select.propTypes = {
  blank: PropTypes.node,
  onChange: PropTypes.func.isRequired,
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

Select.defaultProps = {
  blank: null,
  value: null,
};
