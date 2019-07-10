import React, { useMemo, forwardRef, Fragment, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { optionise } from '../helpers/optionise.js';
import { useGrouped } from '../hooks/use_grouped.js';

export const ListBox = forwardRef((
  { id, setValue, options: rawOptions, value, ...props },
  ref,
) => {
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);
  const listRef = useRef();

  useImperativeHandle(ref, () => ({
    focus() {
      listRef.current.focus();
    },
    contains(el) {
      return listRef.current.contains(el);
    },
  }));

  const valueIndex = options.findIndex(option => option.value === value);
  const activeId = valueIndex > -1 ? options[valueIndex].id || `${id}_${valueIndex}` : null;

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
      ref={listRef}
      id={id}
      {...props}
    >
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
              onClick={!disabled && onClick(optionValue)}
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

ListBox.displayName = 'ListBox';
