import React, { useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setSelectedValue, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
} from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';
import { dismemberComponent } from '../../helpers/dismember_component.js';
import { getPlatform } from '../../helpers/get_platform.js';

export function DropDown({
  ButtonComponent, ListBoxComponent, OptionComponent,
  GroupComponent, ValueComponent, DropDownComponent, ...rawProps
}) {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    options, value, setValue, blank, id, className,
    children, managedFocus, platform, ...componentProps
  } = optionisedProps;
  const buttonRef = useRef();
  const listRef = useRef();
  const selectedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, buttonRef, listRef },
    initialState,
    id,
  );
  const { expanded, search, selectedValue } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue, required: true });
  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = options.find(o => o.label.toLowerCase().startsWith(search));
    if (found) {
      dispatch(setSelectedValue(found));
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, setValue]);

  useLayoutEffect(() => {
    if (expanded && options[selectedIndex] && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, options, selectedIndex]);

  const customDropDownComponent = dismemberComponent(DropDownComponent);
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
          onKeyDown={e => dispatch(onButtonKeyDown(e))}
          className={className ? `${className}__button` : null}
          {...customButtonComponent.props}
        >
          {children || (value && value.label) || blank}
        </customButtonComponent.type>
        <customListBoxComponent.type
          ref={listRef}
          id={`${id}_listbox`}
          role={platform === 'mac' ? 'menu' : 'listbox'}
          tabIndex={-1}
          hidden={!expanded}
          aria-activedescendant={options[selectedIndex]?.id || null}
          onFocus={e => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={e => dispatch(onKeyDown(e))}
          className={className ? `${className}__listbox` : null}
          {...customListBoxComponent.props}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, node, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, group }}
                >
                  <customGroupComponent.type
                    id={key}
                    aria-hidden="true" // Hidden otherwise VoiceOver counts the wrong number of options
                    className={className ? `${className}__listbox__group` : null}
                    {...customGroupComponent.props}
                    {...html}
                  >
                    {node ?? label}
                  </customGroupComponent.type>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, node, html, disabled, index, selected, group } = option;
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
                    aria-labelledby={group ? `${group.key} ${key}` : null}
                    data-focused={index === selectedIndex ? 'true' : null}
                    ref={index === selectedIndex ? selectedRef : null}
                    className={className ? `${className}__listbox__option` : null}
                    {...customOptionComponent.props}
                    {...html}
                    onClick={disabled ? null : e => dispatch(onClick(e, option))}
                  >
                    <customValueComponent.type
                      {...customValueComponent.props}
                    >
                      {node ?? label}
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
  ListBoxComponent: 'ul',
  ButtonComponent: 'button',
  GroupComponent: 'li',
  OptionComponent: 'li',
  ValueComponent: Fragment,
  DropDownComponent: Fragment,
};
