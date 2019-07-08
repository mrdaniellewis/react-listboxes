import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useOptionised } from '../hooks/use_optionised.js';
import { useGrouped } from '../hooks/use_grouped.js';

export function Select({ blank, setValue, options: rawOptions, value, ...props }) {
  const options = useOptionised(rawOptions, blank);
  const grouped = useGrouped(options);
  const valueIndex = options.findIndex(option => option.value === value);

  return (
    <select
      value={valueIndex === -1 ? '' : valueIndex}
      onChange={({ target: { value: index } }) => setValue(options[+index].value)}
      {...props}
    >
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
  setValue: PropTypes.func.isRequired,
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

Select.defaultProps = {
  blank: null,
  value: null,
};
