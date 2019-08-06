import React, { forwardRef, Fragment, useRef, useImperativeHandle, useContext, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { options as validateOptions } from '../validators/options.js';
import { component } from '../validators/component.js';
import { Context } from '../context.js';
import { GROUP } from '../constants/group.js';

export const ListBox = forwardRef((
  { id, setValue, options, valueIndex, selectedIndex, managedFocus, expanded,
    ListBoxComponent, GroupComponent, OptionComponent, ValueComponent, ...props },
  ref,
) => {
  const listRef = useRef();
  const currentContext = useContext(Context);

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

  const selectedRef = useRef();

  useLayoutEffect(() => {
    if (expanded && selectedRef.current && managedFocus) {
      selectedRef.current.focus();
    }
  }, [expanded, selectedIndex, managedFocus]);

  return (
    // eslint-disable-next-line jsx-a11y/aria-activedescendant-has-tabindex
    <ListBoxComponent
      role="listbox"
      tabIndex={-1}
      ref={listRef}
      id={id}
      {...props}
    >
      {options.map((option, i) => {
        const {
          id: optionId, index, label, key, disabled, node, data: _1, onClick: _2, ...more
        } = option;

        return (
          <Context.Provider key={key || i} value={{ ...currentContext, ...option }}>
            {option.value === GROUP
              ? (
                <GroupComponent>
                  {option.label}
                </GroupComponent>
              )
              : (
                <OptionComponent
                  id={optionId}
                  role="option"
                  tabIndex={-1}
                  aria-selected={index === valueIndex ? 'true' : null}
                  aria-disabled={disabled ? 'true' : null}
                  data-focused={index === selectedIndex ? 'true' : null}
                  ref={index === selectedIndex ? selectedRef : null}
                  onClick={disabled ? null : onClick(option)}
                  {...more}
                >
                  <ValueComponent>
                    {node || label}
                  </ValueComponent>
                </OptionComponent>
              )
            }
          </Context.Provider>
        );
      })}
    </ListBoxComponent>
  );
});

ListBox.propTypes = {
  blank: PropTypes.node,
  expanded: PropTypes.bool,
  id: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  options: validateOptions.isRequired,
  valueIndex: PropTypes.number,
  selectedIndex: PropTypes.number,
  managedFocus: PropTypes.bool,
  ListBoxComponent: component,
  OptionComponent: component,
  GroupComponent: component,
  ValueComponent: component,
};

ListBox.defaultProps = {
  blank: null,
  expanded: false,
  valueIndex: null,
  selectedIndex: null,
  managedFocus: true,
  ListBoxComponent: 'ul',
  OptionComponent: 'li',
  GroupComponent: 'li',
  ValueComponent: Fragment,
};

ListBox.displayName = 'ListBox';
