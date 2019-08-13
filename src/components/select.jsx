import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';

export function Select(rawProps) {
  const {
    options, setValue, blank: _1, value: _2, ...props
  } = useNormalisedOptions(rawProps);

  return (
    <select
      value={options.findIndex(o => o.selected)}
      onChange={({ target: { value: index } }) => setValue(options[+index]?.value ?? null)}
      {...props}
    >
      {renderGroupedOptions({
        options,
        renderGroup({ key, html, children, label }) { // eslint-disable-line react/prop-types
          return (
            <optgroup key={key} label={label} {...html}>
              {children}
            </optgroup>
          );
        },
        // eslint-disable-next-line react/prop-types
        renderOption({ label, key, node, html, disabled, index }) {
          return (
            <option
              value={index}
              id={key}
              key={key}
              disabled={disabled}
              {...html}
            >
              {node ?? label}
            </option>
          );
        },
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
