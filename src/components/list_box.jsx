import React, { useMemo, forwardRef, Fragment } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { optionise } from '../helpers/optionise.js';
import { useGrouped } from '../hooks/use_grouped.js';

export const ListBox = forwardRef(({ blank, id, setValue, options: rawOptions, value, ...props }, ref) => {
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);

  const valueIndex = options.findIndex(option => option.value === value);
  let activeId = null;
  if (valueIndex === -1) {
    activeId = blank ? `${id}_blank` : null;
  } else {
    activeId = options[valueIndex].id || `${id}_${valueIndex}`;
  }

  const onClick = newValue => (
    (e) => {
      if (e.button > 0) {
        return;
      }
      setValue(newValue);
    }
  );

  const grouped = useGrouped(options);

  return (
    // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
    <ul
      role="listbox"
      aria-activedescendant={activeId}
      tabIndex={-1}
      ref={ref}
      {...props}
    >
      {blank && (
        // eslint-disable-next-line jsx-a11y/click-events-have-key-events
        <li
          id={`${id}_blank`}
          role="option"
          aria-selected={valueIndex === -1 ? 'true' : 'false'}
          onClick={onClick(null)}
        >
          {blank}
        </li>
      )}
      {grouped.map(({ name, children }, i) => (
        // TODO: See if nesting options in groups breaks user agents
        <Fragment key={name || i}>
          {name && (
            <li>
              {name}
            </li>
          )}
          {children.map(({
            id: optionId, index, label, key, value: optionValue, disabled, ...more
          }) => (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events
            <li
              id={optionId || `${id}_${index}`}
              role="option"
              aria-selected={index === valueIndex ? 'true' : 'false'}
              aria-disabled={disabled ? 'true' : null}
              key={key || optionId || optionValue}
              onClick={!disabled && onClick(value)}
              {...more}
            >
              {label}
            </li>
          ))}
        </Fragment>
      ))}
    </ul>
  );
});

ListBox.propTypes = {
  blank: PropTypes.node,
  id: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ListBox.defaultProps = {
  blank: null,
  value: null,
};
