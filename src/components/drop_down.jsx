import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './drop_down/reducer.js';
import { initialState } from './drop_down/initial_state.js';
import {
  clearSearch, onKeyDown, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
  onSelectValue, setFocusedOption, onOptionsChanged,
} from './drop_down/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { bemClassGenerator } from '../helpers/bem_class_generator.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';
import { findOption } from '../helpers/find_option.js';
import { extractProps } from '../helpers/extract_props.js';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    'aria-labelledby': ariaLabelledBy,
    required, disabled,
    options, value, id, className,
    children, managedFocus, layoutListBox,
    classGenerator, selectedOption, findOption: currentFindOption,
    WrapperComponent, wrapperProps,
    ComboBoxComponent, comboBoxProps,
    ListBoxComponent, listBoxProps,
    GroupComponent, groupProps,
    GroupLabelComponent, groupLabelProps,
    OptionComponent, optionProps,
    ValueComponent, valueProps,
  } = optionisedProps;
  const comboBoxRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, comboBoxRef, listRef },
    initialState,
  );
  const [
    { className: listClassName, style: listStyle },
    setListProps,
  ] = useState({ className: null, style: null });

  const { expanded, search, focusedOption } = state;
  const [handleBlur, handleFocus] = useOnBlur(() => dispatch(onBlur()), listRef);

  useEffect(() => {
    if (!search?.trim?.()) {
      return undefined;
    }
    const found = options.find((o) => currentFindOption(o, search));
    if (found) {
      if (expanded) {
        dispatch(setFocusedOption(found));
      } else {
        dispatch(onSelectValue(found));
      }
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, expanded, currentFindOption]);

  useLayoutEffect(() => {
    if (expanded && focusedOption && managedFocus) {
      focusedRef.current?.focus?.();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption]);

  useLayoutEffect(() => {
    if (layoutListBox && expanded) {
      const listProps = layoutListBox({
        listBox: listRef.current,
        comboBox: comboBoxRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        setListProps({
          style: listProps.style || null,
          className: listProps.className || null,
        });
      }
    }
  }, [layoutListBox, expanded, focusedOption]);

  useLayoutEffect(() => {
    dispatch(onOptionsChanged());
  }, [options]);

  const combinedRef = useCombineRefs(comboBoxRef, ref);

  const classes = classGenerator(className);

  const contextValue = { props: optionisedProps, state };

  return (
    <Context.Provider value={contextValue}>
      <WrapperComponent
        {...(WrapperComponent === Fragment ? undefined : { className })}
        {...wrapperProps}
      >
        <ComboBoxComponent
          role="combobox"
          id={id}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : null}
          aria-activedescendant={focusedOption?.key || null}
          aria-labelledby={ariaLabelledBy}
          aria-readonly="true"
          aria-required={required ? 'true' : null}
          aria-disabled={disabled ? 'true' : null}
          tabIndex={disabled ? null : 0}
          ref={combinedRef}
          onClick={(e) => dispatch(onToggleOpen(e))}
          onKeyDown={(e) => dispatch(onButtonKeyDown(e))}
          onMouseDown={(e) => e.preventDefault()}
          className={classes('combobox')}
          {...comboBoxProps}
          {...extractProps(optionisedProps, 'aria-*', 'data-*')}
        >
          {(children ?? value?.label ?? selectedOption?.label) || '\u00A0'}
        </ComboBoxComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          hidden={!expanded}
          aria-activedescendant={focusedOption?.key || null}
          tabIndex={-1}
          onFocus={(e) => {
            handleFocus();
            dispatch(onFocus(e));
          }}
          onBlur={handleBlur}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          className={joinTokens(classes('listbox'), listClassName)}
          {...listBoxProps}
          style={listStyle}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...contextValue, group }}
                >
                  <GroupComponent
                    {...groupProps}
                  >
                    <GroupLabelComponent
                      id={key}
                      className={classes('group')}
                      aria-hidden="true" // Prevent screen readers reading the wrong number of options
                      {...groupLabelProps}
                      {...html}
                    >
                      {label}
                    </GroupLabelComponent>
                    {groupChildren}
                  </GroupComponent>
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, html, disabled: optionDisabled, group } = option;
              const selected = focusedOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...contextValue, group, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={optionDisabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    className={classes('option', selected && 'focused', group && 'grouped')}
                    {...optionProps}
                    {...html}
                    onClick={optionDisabled ? null : (e) => dispatch(onClick(e, option))}
                  >
                    {/*
                        Prefix the label with the group
                        VoiceOver will not read any label in managedFocus mode if
                        if aria-label or aria-labelledby is applied to the option
                    */}
                    <ValueComponent
                      aria-labelledby={group ? `${group?.key} ${key}_label` : null}
                      id={group ? `${key}_label` : null}
                      {...valueProps}
                    >
                      {label}
                    </ValueComponent>
                  </OptionComponent>
                </Context.Provider>
              );
            },
          })}
        </ListBoxComponent>
      </WrapperComponent>
    </Context.Provider>
  );
});

DropDown.propTypes = {
  'aria-labelledby': PropTypes.string,
  'aria-invalid': PropTypes.string,
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
  disabled: PropTypes.bool,
  findOption: PropTypes.func,

  WrapperComponent: componentValidator,
  wrapperProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  ComboBoxComponent: componentValidator,
  comboBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  groupProps: PropTypes.object,
  GroupLabelComponent: componentValidator,
  groupLabelProps: PropTypes.object,
  OptionComponent: componentValidator,
  optionProps: PropTypes.object,
  ValueComponent: componentValidator,
  valueProps: PropTypes.object,
};

DropDown.defaultProps = {
  'aria-labelledby': null,
  'aria-invalid': null,
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
  disabled: false,
  findOption,
  WrapperComponent: 'div',
  wrapperProps: null,
  ListBoxComponent: 'ul',
  listBoxProps: null,
  ComboBoxComponent: 'div',
  comboBoxProps: null,
  GroupComponent: Fragment,
  groupProps: null,
  GroupLabelComponent: 'li',
  groupLabelProps: null,
  OptionComponent: 'li',
  optionProps: null,
  ValueComponent: 'div',
  valueProps: null,
};

DropDown.displayName = 'DropDown';
