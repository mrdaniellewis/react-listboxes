import React, { useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setFocusedIndex, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
  onOptionsChanged,
} from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { usePrevious } from '../../hooks/use_previous.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';
import { dismemberComponent } from '../../helpers/dismember_component.js';
import { getPlatform } from '../../helpers/get_platform.js';

export function DropDown(rawProps) {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    options, value: _, setValue, id, className,
    children, platform, selectedIndex, managedFocus,
    ButtonComponent, ListBoxComponent, OptionComponent,
    GroupComponent, ValueComponent, DropDownComponent,
    ...componentProps
  } = optionisedProps;
  const buttonRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, buttonRef, listRef },
    initialState,
    id,
  );
  const { expanded, search, focusedIndex } = state;
  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);

  const prevOptions = usePrevious(options);
  useEffect(() => (
    dispatch(onOptionsChanged(prevOptions))
  ), [prevOptions]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = options.findIndex((o) => (
      !o.unselectable && o.label.toLowerCase().startsWith(search)
    ));
    if (found > -1) {
      dispatch(setFocusedIndex(found));
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, setValue]);

  useLayoutEffect(() => {
    if (expanded && options[focusedIndex] && managedFocus) {
      focusedRef.current.focus();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, options, focusedIndex]);

  const customDropDownComponent = dismemberComponent(DropDownComponent, 'div');
  const customButtonComponent = dismemberComponent(ButtonComponent, 'button');
  const customListBoxComponent = dismemberComponent(ListBoxComponent, 'ul');
  const customGroupComponent = dismemberComponent(GroupComponent, 'li');
  const customOptionComponent = dismemberComponent(OptionComponent, 'li');
  const customValueComponent = dismemberComponent(ValueComponent);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, listRef, buttonRef, ...state }}>
      <customDropDownComponent.type
        {...(customDropDownComponent.type === Fragment ? undefined : { className })}
        {...customDropDownComponent.props}
        {...componentProps}
      >
        <customButtonComponent.type
          type="button"
          role={platform === 'windows' ? 'combobox' : null}
          id={id}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : { mac: null, windows: 'false' }[platform]}
          aria-haspopup={platform === 'mac' ? 'menu' : 'listbox'}
          ref={buttonRef}
          onClick={() => dispatch(onToggleOpen())}
          onKeyDown={(e) => dispatch(onButtonKeyDown(e))}
          className={className ? `${className}__button` : null}
          {...customButtonComponent.props}
        >
          {children ?? options[selectedIndex].label}
        </customButtonComponent.type>
        <customListBoxComponent.type
          ref={listRef}
          id={`${id}_listbox`}
          role={platform === 'mac' ? 'listbox' : 'listbox'}
          tabIndex={-1}
          hidden={!expanded}
          aria-activedescendant={options[focusedIndex]?.key || null}
          onFocus={(e) => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          className={className ? `${className}__listbox` : null}
          {...customListBoxComponent.props}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, index, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, group }}
                >
                  <customGroupComponent.type
                    id={key}
                    ref={index === focusedIndex ? focusedRef : null}
                    data-focused={index === focusedIndex ? 'true' : null}
                    role="group"
                    aria-label={label}
                    tabIndex={-1}
                    aria-disabled="true"
                    className={className ? `${className}__listbox__group` : null}
                    {...customGroupComponent.props}
                    {...html}
                  >
                    {label}
                  </customGroupComponent.type>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, html, disabled, index, selected, group } = option;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, option }}
                >
                  <customOptionComponent.type
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    data-focused={index === focusedIndex ? 'true' : null}
                    data-grouped={group ? 'true' : null}
                    ref={index === focusedIndex ? focusedRef : null}
                    className={className ? `${className}__listbox__option` : null}
                    {...customOptionComponent.props}
                    {...html}
                    onClick={disabled ? null : (e) => dispatch(onClick(e, option))}
                  >
                    <customValueComponent.type
                      {...customValueComponent.props}
                    >
                      {label}
                    </customValueComponent.type>
                  </customOptionComponent.type>
                </Context.Provider>
              );
            },
          })}
        </customListBoxComponent.type>
      </customDropDownComponent.type>
    </Context.Provider>
  );
}

DropDown.propTypes = {
  blank: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  managedFocus: PropTypes.bool,
  platform: PropTypes.oneOf(['mac', 'windows']),
  className: PropTypes.string,
  ListBoxComponent: componentCustomiser,
  ButtonComponent: componentCustomiser,
  GroupComponent: componentCustomiser,
  OptionComponent: componentCustomiser,
  ValueComponent: componentCustomiser,
  DropDownComponent: componentCustomiser,
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  value: null,
  className: 'dropdown',
  managedFocus: true,
  platform: getPlatform(),
  ListBoxComponent: null,
  ButtonComponent: null,
  GroupComponent: null,
  OptionComponent: null,
  ValueComponent: null,
  DropDownComponent: null,
};
