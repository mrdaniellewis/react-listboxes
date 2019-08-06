import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useOptionisedProps } from '../hooks/use_optionised_props.js';
import { reGroup } from '../helpers/re_group.js';

export function Select(rawProps) {
  const {
    options, valueIndex, setValue, blank: _1, value: _2, ...props
  } = useOptionisedProps(rawProps);
  const grouped = useMemo(() => reGroup(options), [options]);

  return (
    <select
      value={valueIndex === -1 ? '' : valueIndex}
      onChange={({ target: { value: index } }) => setValue(options[+index])}
      {...props}
    >
      {grouped.map(({ label: groupLabel, children }) => {
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
        if (groupLabel) {
          return (
            <optgroup label={groupLabel} key={groupLabel}>
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
