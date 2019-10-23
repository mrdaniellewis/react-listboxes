import React, { useRef, useMemo, useEffect, useLayoutEffect, Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { usePrevious } from '../../hooks/use_previous.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onButtonKeyDown, onKeyDown, setExpanded, onClick, setSelectedIndex } from './actions.js';
import { Context } from '../../context.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { useHoverIntent } from '../../hooks/use_hover_intent.js';
import { useOnMouseLeave } from '../../hooks/use_on_mouse_leave.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { dismemberComponent } from '../../helpers/dismember_component.js';

export function MenuButton({
  MenuButtonComponent, MenuComponent, MenuItemComponent, ButtonComponent,
  children, ...props
}) {
  const { options: rawOptions, id, managedFocus, openOnHover, ...componentProps } = props;

  const options = useMemo(() => {
    const customMenuItem = dismemberComponent(MenuItemComponent);
    return rawOptions.map((option, index) => {
      const optionComponent = dismemberComponent(option);
      const derivedId = `${id}_option_${index}`;
      return {
        ...customMenuItem.props,
        id: derivedId,
        ...optionComponent.props,
        Component: optionComponent.type || customMenuItem.type,
      };
    });
  }, [rawOptions, id, MenuItemComponent]);

  const buttonRef = useRef();
  const menuRef = useRef();
  const selectedRef = useRef();

  const [state, dispatch] = useReducer(reducer, { ...props, options, buttonRef }, initialState, id);
  const { expanded, selectedIndex } = state;
  const selectedId = (selectedIndex > -1 && options[selectedIndex]?.id) || null;

  const dispatchExpandedFalse = useCallback(() => dispatch(setExpanded(false)), []);
  const dispatchExpandedTrue = useCallback(() => dispatch(setExpanded(true)), []);
  const onBlurHandler = useOnBlur(dispatchExpandedFalse, menuRef);
  const prevOptions = usePrevious(options);
  const onMouseEnterHandler = useHoverIntent(dispatchExpandedTrue);
  const onMouseLeaveHandler = useOnMouseLeave(dispatchExpandedFalse, buttonRef, menuRef);

  useEffect(() => {
    if (selectedIndex > -1 && prevOptions[selectedIndex]?.id !== options[selectedIndex]?.id) {
      dispatch.setSelectedIndex(options.findIndex((o) => o.id === prevOptions[selectedIndex]?.id));
    }
  }, [options, selectedIndex, prevOptions]);

  useLayoutEffect(() => {
    if (expanded && selectedRef.current && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded && !(managedFocus && selectedIndex > -1)) {
      menuRef.current.focus();
    }
  }, [expanded, managedFocus, selectedIndex]);

  const customMenuButton = dismemberComponent(MenuButtonComponent);
  const customButton = dismemberComponent(ButtonComponent);
  const customMenu = dismemberComponent(MenuComponent);

  return (
    <Context.Provider value={{ dispatch, ...props, ...state }}>
      <customMenuButton.type
        {...componentProps}
        {...customMenuButton.props}
      >
        <customButton.type
          type="button"
          id={id}
          aria-haspopup="menu"
          aria-expanded={expanded ? 'true' : null}
          aria-controls={`${id}_menu`}
          ref={buttonRef}
          onClick={() => dispatch(setExpanded(true))}
          onKeyDown={(e) => dispatch(onButtonKeyDown(e))}
          onMouseEnter={openOnHover ? onMouseEnterHandler : null}
          onMouseLeave={openOnHover ? onMouseLeaveHandler : null}
          {...customButton.props}
        >
          {children}
        </customButton.type>
        <customMenu.type
          ref={menuRef}
          id={`${id}_menu`}
          role="menu"
          tabIndex={-1}
          hidden={!expanded}
          onBlur={onBlurHandler}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          aria-activedescendant={selectedId}
          onMouseLeave={openOnHover ? onMouseLeaveHandler : null}
          {...customMenu.props}
        >
          {options.map((option, index) => {
            const {
              Component = MenuItemComponent, label, key, id: optionId,
              disabled, children: optionChildren, ...more
            } = option;

            return (
              <Context.Provider
                key={key || optionId}
                value={{ dispatch, ...state, ...props, ...option }}
              >
                <Component
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
              </Context.Provider>
            );
          })}
        </customMenu.type>
      </customMenuButton.type>
    </Context.Provider>
  );
}

MenuButton.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(componentCustomiser).isRequired,
  managedFocus: PropTypes.bool,
  openOnHover: PropTypes.bool,
  ButtonComponent: componentCustomiser,
  MenuButtonComponent: componentCustomiser,
  MenuComponent: componentCustomiser,
  MenuItemComponent: componentCustomiser,
};

MenuButton.defaultProps = {
  children: null,
  managedFocus: true,
  openOnHover: false,
  ButtonComponent: 'button',
  MenuItemComponent: 'li',
  MenuComponent: 'ul',
  MenuButtonComponent: Fragment,
};
