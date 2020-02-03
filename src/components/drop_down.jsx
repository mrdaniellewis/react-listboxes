import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './drop_down/reducer.js';
import { initialState } from './drop_down/initial_state.js';
import {
  clearSearch, onKeyDown, setFocusedIndex, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
  onOptionsChanged, setListProps, onSelectValue,
} from './drop_down/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { usePrevious } from '../hooks/use_previous.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { bemClassGenerator } from '../helpers/bem_class_generator.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    'aria-labelledby': ariaLabelledBy, required,
    options, value: _1, onValue: _3, id, className,
    children, selectedIndex, managedFocus, layoutListBox,
    classGenerator,
    DropDownComponent, DropDownProps,
    ComboBoxComponent, ComboBoxProps,
    ListBoxComponent, ListBoxProps,
    OptionComponent, OptionProps,
    GroupComponent, GroupProps,
    GroupWrapperComponent, GroupWrapperProps,
    ValueComponent, ValueProps,
    ...componentProps
  } = optionisedProps;
  const comboBoxRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, comboBoxRef, listRef },
    initialState,
  );
  const { expanded, search, focusedIndex, listClassName, listStyle } = state;
  const [handleBlur, handleFocus] = useOnBlur(() => dispatch(onBlur()), listRef);

  const prevOptions = usePrevious(options);
  useLayoutEffect(() => {
    if (prevOptions && prevOptions !== options) {
      dispatch(onOptionsChanged(prevOptions));
    }
  }, [prevOptions, options]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = options.findIndex((o) => o.label.toLowerCase().startsWith(search));
    if (found > -1) {
      if (expanded) {
        dispatch(setFocusedIndex(found));
      } else {
        dispatch(onSelectValue(options[found]));
      }
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, expanded]);

  useLayoutEffect(() => {
    if (expanded && options[focusedIndex] && managedFocus) {
      focusedRef.current.focus();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, options, focusedIndex]);

  useLayoutEffect(() => {
    if (layoutListBox && expanded) {
      const listProps = layoutListBox({
        listBox: listRef.current,
        comboBox: comboBoxRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        dispatch(setListProps(listProps));
      }
    }
  }, [layoutListBox, expanded, focusedIndex, options]);

  const combinedRef = useCombineRefs(comboBoxRef, ref);

  const classes = classGenerator(className);

  return (
    <Context.Provider value={{ dispatch, props: optionisedProps, state }}>
      <DropDownComponent
        {...(DropDownComponent === Fragment ? undefined : { className })}
        {...DropDownProps}
        {...componentProps}
      >
        <ComboBoxComponent
          role="combobox"
          id={id}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : null}
          aria-activedescendant={options[focusedIndex]?.key || null}
          aria-labelledby={ariaLabelledBy}
          aria-readonly="true"
          aria-required={required ? 'true' : null}
          tabIndex={0}
          ref={combinedRef}
          onClick={(e) => dispatch(onToggleOpen(e))}
          onKeyDown={(e) => dispatch(onButtonKeyDown(e))}
          className={classes('combobox')}
          {...ComboBoxProps}
        >
          {(children ?? options[selectedIndex]?.label) || null}
        </ComboBoxComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          hidden={!expanded}
          tabIndex={-1}
          onFocus={(e) => {
            handleFocus(e);
            dispatch(onFocus(e));
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          className={joinTokens(classes('listbox'), listClassName)}
          {...ListBoxProps}
          style={listStyle}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, props: optionisedProps, state, group }}
                >
                  <GroupWrapperComponent
                    {...GroupWrapperProps}
                  >
                    <GroupComponent
                      id={key}
                      className={classes('group')}
                      aria-hidden="true" // Prevent screen readers reading the wrong number of options
                      {...GroupProps}
                      {...html}
                    >
                      {label}
                    </GroupComponent>
                    {groupChildren}
                  </GroupWrapperComponent>
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, html, disabled, index, group } = option;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, props: optionisedProps, state, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={focusedIndex === index ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={index === focusedIndex ? focusedRef : null}
                    className={classes('option', index === focusedIndex && 'focused', group && 'grouped')}
                    {...OptionProps}
                    {...html}
                    onClick={disabled ? null : (e) => dispatch(onClick(e, option))}
                  >
                    {/*
                        Prefix the label with the group
                        VoiceOver will not read any label in managedFocus mode if
                        if aria-label or aria-labelledby is applied to the option
                    */}
                    <ValueComponent
                      aria-labelledby={group ? `${group?.key} ${key}_label` : null}
                      id={group ? `${key}_label` : null}
                      {...ValueProps}
                    >
                      {label}
                    </ValueComponent>
                  </OptionComponent>
                </Context.Provider>
              );
            },
          })}
        </ListBoxComponent>
      </DropDownComponent>
    </Context.Provider>
  );
});

DropDown.propTypes = {
  'aria-labelledby': PropTypes.string,
  blank: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  layoutListBox: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  onValue: PropTypes.func,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  managedFocus: PropTypes.bool,
  className: PropTypes.string,
  skipOption: PropTypes.func,
  classGenerator: PropTypes.func,
  required: PropTypes.bool,

  ListBoxComponent: componentValidator,
  ListBoxProps: PropTypes.object,
  ComboBoxComponent: componentValidator,
  ComboBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  GroupProps: PropTypes.object,
  GroupWrapperComponent: componentValidator,
  GroupWrapperProps: PropTypes.object,
  OptionComponent: componentValidator,
  OptionProps: PropTypes.object,
  ValueComponent: componentValidator,
  ValueProps: PropTypes.object,
  DropDownComponent: componentValidator,
  DropDownProps: PropTypes.object,
};

DropDown.defaultProps = {
  'aria-labelledby': null,
  blank: '',
  children: null,
  layoutListBox: null,
  value: null,
  className: 'dropdown',
  managedFocus: true,
  onValue: () => {},
  skipOption: undefined,
  classGenerator: bemClassGenerator,
  required: false,

  ListBoxComponent: 'ul',
  ListBoxProps: null,
  ComboBoxComponent: 'div',
  ComboBoxProps: null,
  GroupComponent: 'li',
  GroupProps: null,
  GroupWrapperComponent: Fragment,
  GroupWrapperProps: null,
  OptionComponent: 'li',
  OptionProps: null,
  ValueComponent: 'div',
  ValueProps: null,
  DropDownComponent: 'div',
  DropDownProps: null,
};

DropDown.displayName = 'DropDown';
