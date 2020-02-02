import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './combo_box/reducer.js';
import { initialState } from './combo_box/initial_state.js';
import { onKeyDown, onChange, onFocus, onSelectValue, onBlur, onOptionsChanged, setListProps } from './combo_box/actions.js';
import { options as validateOptions } from '../validators/options.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { usePrevious } from '../hooks/use_previous.js';
import { bemClassGenerator } from '../helpers/bem_class_generator.js';

export function ComboBox(rawProps) {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy,
    options, value, id, className,
    notFoundMessage, layoutListBox, managedFocus, busy,
    selectedIndex: _1, onValue: _2,
    onSearch, autoComplete, showSelectedValue,
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

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, inputRef, lastKeyRef },
    initialState,
  );

  const {
    expanded, focusedIndex, search, listClassName, listStyle, focusListBox, inlineAutoComplete,
  } = state;
  const [handleBlur, handleFocus] = useOnBlur(() => dispatch(onBlur()), comboRef);

  const prevOptions = usePrevious(options);
  useLayoutEffect(() => {
    if (prevOptions && prevOptions !== options) {
      dispatch(onOptionsChanged(prevOptions));
    }
  }, [prevOptions, options]);

  useLayoutEffect(() => {
    if (expanded && options[focusedIndex] && managedFocus && focusListBox) {
      focusedRef.current?.focus?.();
    } else if (expanded && document.activeElement !== inputRef.current) {
      inputRef.current.focus();
    }
  }, [expanded, managedFocus, options, focusedIndex, focusListBox]);

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
  }, [layoutListBox, expanded, focusedIndex, options]);

  useEffect(() => {
    if (onSearch) {
      onSearch((search ?? value?.label) || '');
    }
  }, [onSearch, search, value]);

  let inputLabel = search ?? value?.label;
  if (inlineAutoComplete || ((showSelectedValue ?? autoComplete === 'inline') && focusListBox)) {
    inputLabel = options[focusedIndex]?.label;
  }

  useLayoutEffect(() => {
    if (search && autoComplete === 'inline' && inlineAutoComplete && options[focusedIndex]) {
      inputRef.current.setSelectionRange(search.length, options[focusedIndex].label.length);
    }
  }, [inlineAutoComplete, options, focusedIndex, search, autoComplete]);

  const ariaAutocomplete = useMemo(() => {
    if (!onSearch) {
      return 'none';
    }
    if (autoComplete === 'inline') {
      return 'both';
    }
    return 'list';
  }, [onSearch, autoComplete]);

  const classes = bemClassGenerator(className);
  const showListBox = expanded && options.length
    && !(!search && options.length === 1 && options[0].identity === value?.identity);
  const showNotFound = expanded && !options.length && search?.trim();
  const showBusy = busy && search !== (value?.label);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
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
          aria-activedescendant={focusListBox ? options[focusedIndex]?.key : null}
          value={inputLabel || ''}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onChange={(e) => dispatch(onChange(e))}
          onFocus={(e) => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={inputRef}
          className={classes('input', expanded && 'focused', options[focusedIndex]?.unselectable && 'unselectable')}
          tabIndex={managedFocus && focusListBox ? -1 : 0}
          {...InputProps}
        />
        <ClearButtonComponent
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            if (e.button > 0) {
              return;
            }
            inputRef.current.focus();
            dispatch(onSelectValue(null));
          }}
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
          aria-activedescendant={focusListBox ? options[focusedIndex]?.key : null}
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
                  value={{ dispatch, ...optionisedProps, ...state, group }}
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
              const { label, key, html, disabled, group, index } = option;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, option }}
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
                    onClick={disabled ? null : () => dispatch(onSelectValue(option))}
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
}

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
  autoComplete: PropTypes.oneOf([false, true, 'inline']),
  showSelectedValue: PropTypes.bool,

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
  showSelectedValue: undefined,

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
