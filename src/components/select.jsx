import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { arrayMembers } from '../validators/array_members.js';
import { optionise } from '../helpers/optionise.js';

export function Select({ blank, onChange, options: rawOptions, value, ...props }) {
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);

  const grouped = useMemo(
    () => {
      let lastGroup = null;
      return options.reduce((array, { group, ...values }, index) => {
        if (group !== lastGroup) {
          array.unshift({ name: group, children: [] });
          lastGroup = group;
        }
        array[0].children.push({ ...values, index });
        return array;
      }, []).reverse();
    },
    [options],
  );

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
  options: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.arrayOf(arrayMembers([
      PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      PropTypes.string.isRequired,
    ])),
    PropTypes.shape({
      disabled: PropTypes.bool,
      value: PropTypes.any.isRequired,
      label: PropTypes.node.isRequired,
      group: PropTypes.string,
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
      key: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]),
    }),
  ])).isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

Select.defaultProps = {
  blank: null,
  value: null,
};
