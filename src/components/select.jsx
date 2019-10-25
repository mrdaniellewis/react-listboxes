import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useSelectedIndex } from '../hooks/use_selected_index.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';

export function Select(rawProps) {
  const {
    options, setValue, value, blank: _1, ...props
  } = useNormalisedOptions(rawProps);

  const selectedIndex = useSelectedIndex({ options, selectedValue: value });

  return (
    <select
      value={selectedIndex}
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
