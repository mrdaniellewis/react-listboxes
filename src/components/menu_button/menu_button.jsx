import React, { useRef, useLayoutEffect, Fragment, isValidElement } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { options as validateOptions } from '../../validators/options.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onButtonKeyDown, onKeyDown, setExpanded, onClick, setSelectedIndex } from './actions.js';
import { Context } from '../../context.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { component } from '../../validators/component.js';

export function MenuButton({
  MenuButtonComponent, MenuComponent, MenuItemComponent, ButtonComponent,
  children, ...props
}) {
  const { options, id, managedFocus, ...componentProps } = props;
  const buttonRef = useRef();
  const menuRef = useRef();
  const selectedRef = useRef();
  const [state, dispatch] = useReducer(reducer, { ...props, buttonRef }, initialState, id);
  const { expanded, selectedIndex } = state;

  const onBlurHandler = useOnBlur(() => dispatch(setExpanded(false)), menuRef);

  useLayoutEffect(() => {
    if (expanded && selectedRef.current && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded && !(managedFocus && selectedIndex > -1)) {
      menuRef.current.focus();
    }
  }, [expanded, managedFocus, selectedIndex]);

  return (
    <Context.Provider value={{ dispatch, ...props, ...state }}>
      <MenuButtonComponent
        {...componentProps}
      >
        <ButtonComponent
          type="button"
          id={id}
          aria-haspopup="menu"
          aria-expanded={expanded ? 'true' : null}
          aria-controls={`${id}_menu`}
          ref={buttonRef}
          onClick={() => dispatch(setExpanded(true))}
          onKeyDown={e => dispatch(onButtonKeyDown(e))}
        >
          {children}
        </ButtonComponent>
        <MenuComponent
          ref={menuRef}
          id={`${id}_menu`}
          role="menu"
          tabIndex={-1}
          hidden={!expanded}
          onBlur={onBlurHandler}
          onKeyDown={e => dispatch(onKeyDown(e))}
          aria-activedescendant={selectedIndex > -1 ? options[selectedIndex].id : null}
        >
          {options.map((option, index) => {
            if (isValidElement(option)) {
              option = { // eslint-disable-line no-param-reassign
                ...option.props,
                type: option.type,
              };
            }

            const {
              type: Component = MenuItemComponent, label, key, id: optionId,
              disabled, children: optionChildren, ...more
            } = option;

            return (
              <Component
                key={key || optionId || index}
                id={optionId || `${id}_option_index`}
                role="menuitem"
                tabIndex={-1}
                aria-disabled={disabled ? 'true' : null}
                data-focused={index === selectedIndex ? 'true' : null}
                ref={index === selectedIndex ? selectedRef : null}
                {...more}
                onClick={disabled ? null : () => dispatch(onClick(option))}
                onFocus={() => dispatch(setSelectedIndex(index))}
              >
                {optionChildren || label}
              </Component>
            );
          })}
        </MenuComponent>
      </MenuButtonComponent>
    </Context.Provider>
  );
}

MenuButton.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  options: validateOptions.isRequired,
  managedFocus: PropTypes.bool,
  ButtonComponent: component,
  MenuButtonComponent: component,
  MenuComponent: component,
  MenuItemComponent: component,
};

MenuButton.defaultProps = {
  children: null,
  managedFocus: true,
  ButtonComponent: 'button',
  MenuItemComponent: 'li',
  MenuComponent: 'ul',
  MenuButtonComponent: Fragment,
};
