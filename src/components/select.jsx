import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useOptionisedProps } from '../hooks/use_optionised_props.js';
import { useGrouped } from '../hooks/use_grouped.js';

export function Select(rawProps) {
  const { options, valueIndex, setValue, blank, value, ...props } = useOptionisedProps(rawProps);
  const grouped = useGrouped(options);

  return (
    <select
      value={valueIndex === -1 ? '' : valueIndex}
      onChange={({ target: { value: index } }) => setValue(options[+index])}
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
