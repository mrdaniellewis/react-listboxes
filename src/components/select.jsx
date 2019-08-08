import React from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useGroupedOptions } from '../hooks/use_grouped_options.js';

export function Select(rawProps) {
  const {
    options, setValue, blank: _1, value: _2, ...props
  } = useNormalisedOptions(rawProps);
  const groupedOptions = useGroupedOptions(options);

  return (
    <select
      value={options.find(o => o.selected)?.index ?? ''}
      onChange={({ target: { value: index } }) => setValue(options[+index]?.value ?? null)}
      {...props}
    >
      {groupedOptions.map((group) => {
        const optionNodes = group.options.map(({
          label, index, key, node, selected: _3, value: _4, ...more
        }) => (
          <option
            value={index}
            key={key}
            {...more}
          >
            {label ?? node}
          </option>
        ));

        if (group.label) {
          const { key, ...more } = group;
          return (
            <optgroup
              key={key}
              {...more}
            >
              {optionNodes}
            </optgroup>
          );
        }
        return optionNodes;
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
