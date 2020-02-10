import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './combo_box/reducer.js';
import { initialState } from './combo_box/initial_state.js';
import { onKeyDown, onChange, onFocus, onClearValue, onBlur, onClick, onOptionsChanged, setListProps, setAriaBusy } from './combo_box/actions.js';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { bemClassGenerator } from '../helpers/bem_class_generator.js';
import { findOption } from '../helpers/find_option.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';

export const ComboBox = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy, busyDebounce,
    options, value, selectedOption, id, className, classGenerator,
    notFoundMessage, layoutListBox, managedFocus, busy, onValue: _2, onSearch,
    autoComplete, showSelectedLabel, findAutoComplete: _3, tabAutoComplete: _4,
    ClearButtonComponent, ClearButtonProps,
    ComboBoxComponent, ComboBoxProps,
    GroupComponent, GroupProps,
    GroupWrapperComponent, GroupWrapperProps,
    InputComponent, InputProps,
    ListBoxComponent, ListBoxProps,
    NotFoundComponent, NotFoundProps,
    OptionComponent, OptionProps,
    ValueComponent, ValueProps,
    ...componentProps
  } = optionisedProps;

  const comboRef = useRef();
  const inputRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();
  const lastKeyRef = useRef();
  const busyTimeoutRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, inputRef, lastKeyRef },
    initialState,
  );

  const {
    ariaBusy, expanded, focusedOption, search, listClassName,
    listStyle, focusListBox, inlineAutoComplete,
  } = state;
  const [handleBlur, handleFocus] = useOnBlur(() => dispatch(onBlur()), comboRef);


  useLayoutEffect(() => {
    if (layoutListBox && expanded) {
      const listProps = layoutListBox({
        listbox: listRef.current,
        input: inputRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        dispatch(setListProps(listProps));
      }
    }
  }, [layoutListBox, expanded, focusedOption]);

  const searchValue = (search ?? value?.label) || '';
  useEffect(() => {
    if (onSearch) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const inputLabel = useMemo(() => {
    if (inlineAutoComplete
      || (((showSelectedLabel && !focusedOption?.unselectable) ?? autoComplete === 'inline') && focusListBox)
    ) {
      return focusedOption?.label;
    }
    return search ?? value?.label;
  }, [
    inlineAutoComplete, showSelectedLabel, autoComplete,
    focusListBox, focusedOption, search, value,
  ]);

  useLayoutEffect(() => {
    if (search && autoComplete === 'inline' && inlineAutoComplete && focusedOption && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(search.length, focusedOption.label.length, 'backwards');
    }
  }, [inlineAutoComplete, focusedOption, search, autoComplete]);

  const ariaAutocomplete = useMemo(() => {
    if (!onSearch) {
      return 'none';
    }
    if (autoComplete === 'inline') {
      return 'both';
    }
    return 'list';
  }, [onSearch, autoComplete]);

  useLayoutEffect(() => {
    dispatch(onOptionsChanged());
  }, [options]);

  // Do not show the list box is the only option is the currently selected option
  const showListBox = useMemo(() => (
    expanded && options.length
      && !(!search && options.length === 1 && options[0].key === selectedOption?.key)
  ), [expanded, options, search, selectedOption]);

  useLayoutEffect(() => {
    if (expanded && focusedOption && managedFocus && focusListBox && showListBox) {
      focusedRef.current?.focus?.();
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption, focusListBox, showListBox]);

  console.log(busy);
  useEffect(() => {
    clearTimeout(busyTimeoutRef.current);
    if (busy && busyDebounce === null) {
      dispatch(setAriaBusy(true));
    } else if (busy) {
      busyTimeoutRef.current = setTimeout(() => {
        console.log('setBusy');
        dispatch(setAriaBusy(true));
      }, busyDebounce);
    } else {
      dispatch(setAriaBusy(false));
    }
  }, [busy, busyDebounce, busyTimeoutRef]);

  const classes = classGenerator(className);
  const showNotFound = expanded && !options.length && search?.trim();
  const showBusy = ariaBusy && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);

  return (
    <Context.Provider value={{ dispatch, props: optionisedProps, state }}>
      <ComboBoxComponent
        aria-busy={showBusy ? 'true' : 'false'}
        className={className}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={comboRef}
        {...ComboBoxProps}
        {...componentProps}
      >
        <InputComponent
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete={ariaAutocomplete}
          aria-haspopup="true"
          aria-controls={`${id}_listbox`}
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          value={inputLabel || ''}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onChange={(e) => dispatch(onChange(e))}
          onFocus={(e) => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={combinedRef}
          className={classes('input', expanded && 'focused')}
          tabIndex={managedFocus && showListBox && focusListBox ? -1 : 0}
          {...InputProps}
        />
        <ClearButtonComponent
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => dispatch(onClearValue(e))}
          hidden={!value || search === ''}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={joinTokens(`${id}_clear_button`, id)}
          className={classes('clear-button')}
          {...ClearButtonProps}
        />
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onMouseDown={(e) => e.preventDefault()}
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
              const { label, key, html, disabled, group } = option;
              const selected = focusedOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, props: optionisedProps, state, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    className={classes('option', selected && 'focused', group && 'grouped')}
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
        <NotFoundComponent
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
          className={classes('not-found')}
          {...NotFoundProps}
        >
          {showNotFound ? notFoundMessage : null}
        </NotFoundComponent>
      </ComboBoxComponent>
    </Context.Provider>
  );
});

ComboBox.propTypes = {
  'aria-describedby': PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  busy: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  layoutListBox: PropTypes.func,
  managedFocus: PropTypes.bool,
  notFoundMessage: PropTypes.node,
  onSearch: PropTypes.func,
  options: validateOptions.isRequired,
  onValue: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.any,
  showSelectedLabel: PropTypes.bool,
  tabAutoComplete: PropTypes.bool,
  findAutoComplete: PropTypes.func,
  autoComplete: PropTypes.oneOf([false, true, 'inline']),
  classGenerator: PropTypes.func,
  busyDebounce: PropTypes.number,

  ClearButtonComponent: componentValidator,
  ClearButtonProps: PropTypes.object,
  ComboBoxComponent: componentValidator,
  ComboBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  GroupProps: PropTypes.object,
  GroupWrapperComponent: componentValidator,
  GroupWrapperProps: PropTypes.object,
  InputComponent: componentValidator,
  InputProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  ListBoxProps: PropTypes.object,
  NotFoundComponent: componentValidator,
  NotFoundProps: PropTypes.object,
  OptionComponent: componentValidator,
  OptionProps: PropTypes.object,
  ValueComponent: componentValidator,
  ValueProps: PropTypes.object,
};

ComboBox.defaultProps = {
  'aria-describedby': null,
  busy: null,
  className: 'combobox',
  layoutListBox: null,
  managedFocus: true,
  notFoundMessage: 'No matches found',
  value: null,
  onSearch: null,
  onValue: () => {},
  onChange: () => {},
  autoComplete: false,
  showSelectedLabel: undefined,
  tabAutoComplete: false,
  findAutoComplete: findOption,
  classGenerator: bemClassGenerator,
  busyDebounce: 200,

  ClearButtonComponent: 'span',
  ClearButtonProps: null,
  ComboBoxComponent: 'div',
  ComboBoxProps: null,
  GroupComponent: 'li',
  GroupProps: null,
  GroupWrapperComponent: Fragment,
  GroupWrapperProps: null,
  InputComponent: 'input',
  InputProps: null,
  ListBoxComponent: 'ul',
  ListBoxProps: null,
  NotFoundComponent: 'div',
  NotFoundProps: null,
  OptionComponent: 'li',
  OptionProps: null,
  ValueComponent: 'div',
  ValueProps: null,
};

ComboBox.displayName = 'ComboBox';
