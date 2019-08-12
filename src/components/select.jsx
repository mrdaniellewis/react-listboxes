import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';

export function Select(rawProps) {
  const {
    options, flatOptions, setValue, blank: _1, value: _2, ...props
  } = useNormalisedOptions(rawProps);

  console.log(options);
  console.log(flatOptions);

  return (
    <select
      value={flatOptions.findIndex(o => o.selected)?.index ?? ''}
      onChange={({ target: { value: index } }) => setValue(flatOptions[+index]?.value ?? null)}
      {...props}
    >
      {options.map(function mapOptions(option) {
        if (option.options) {
          const { key, ...more } = option;
          return (
            <optgroup
              key={key}
              {...more}
            >
              {option.options.map(mapOptions)}
            </optgroup>
          );
        }

        const { label, index, key, node, selected: _3, value: _4, ...more } = option;
        return (
          <option
            value={index}
            id={key}
            key={key}
            {...more}
          >
            {node ?? label}
          </option>
        );
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
