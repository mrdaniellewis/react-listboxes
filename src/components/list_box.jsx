import React, { forwardRef, Fragment, useRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { useGrouped } from '../hooks/use_grouped.js';

export const ListBox = forwardRef((
  { id, setValue, options, valueIndex, ...props },
  ref,
) => {
  const listRef = useRef();

  useImperativeHandle(ref, () => ({
    focus() {
      listRef.current.focus();
    },
    contains(el) {
      return listRef.current.contains(el);
    },
  }));

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
          {children.map((option) => {
            const { id: optionId, index, label, key, disabled, ...more } = option;
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                id={optionId || `${id}_${index}`}
                role="option"
                aria-selected={index === valueIndex ? 'true' : 'false'}
                aria-disabled={disabled ? 'true' : null}
                key={optionId || label}
                onClick={!disabled && onClick(option)}
                {...more}
              >
                {label}
              </li>
            );
          })}
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
  valueIndex: PropTypes.number,
};

ListBox.defaultProps = {
  blank: null,
  valueIndex: null,
};

ListBox.displayName = 'ListBox';
