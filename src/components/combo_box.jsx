import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './combo_box/reducer.js';
import { initialState } from './combo_box/initial_state.js';
import { onKeyDown, onChange, onFocus, onClearValue, onBlur, onClick, onOptionsChanged } from './combo_box/actions.js';
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
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    WrapperComponent, wrapperProps,
    InputComponent, inputProps,
    ListBoxComponent, listBoxProps,
    GroupComponent, groupProps,
    GroupLabelComponent, groupLabelProps,
    OptionComponent, optionProps,
    ValueComponent, valueProps,
    ClearButtonComponent, clearButtonProps,
    NotFoundComponent, notFoundProps,
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
  const [showBusy, setShowBusy] = useState(false);
  const [
    { className: listClassName, style: listStyle },
    setListProps,
  ] = useState({ className: null, style: null });

  const {
    expanded, focusedOption, search,
    focusListBox, inlineAutoComplete,
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
        setListProps({
          style: listProps.style || null,
          className: listProps.className || null,
        });
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

  useEffect(() => {
    clearTimeout(busyTimeoutRef.current);
    if (busy && busyDebounce === null) {
      setShowBusy(true);
    } else if (busy) {
      busyTimeoutRef.current = setTimeout(() => {
        setShowBusy(true);
      }, busyDebounce);
    } else {
      setShowBusy(false);
    }
  }, [busy, busyDebounce, busyTimeoutRef]);

  const classes = classGenerator(className);
  const showNotFound = !busy && expanded && !options.length && search?.trim();
  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);

  const context = { props: optionisedProps, state };

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        aria-busy={ariaBusy ? 'true' : 'false'}
        className={className}
        onBlur={handleBlur}
        onFocus={handleFocus}
        ref={comboRef}
        {...wrapperProps}
      >
        <InputComponent
          id={id}
          type="text"
          role="combobox"
          // aria-haspopup="listbox" is implicit
          aria-autocomplete={ariaAutocomplete}
          aria-controls={`${id}_listbox`} // ARIA 1.2 pattern
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          value={inputLabel || ''}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onChange={(e) => dispatch(onChange(e))}
          onFocus={(e) => {
            dispatch(onFocus(e));
            passedOnFocus?.(e);
          }}
          onBlur={passedOnBlur ? (e) => passedOnBlur(e) : null}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={combinedRef}
          className={classes('input', expanded && 'focused')}
          tabIndex={managedFocus && showListBox && focusListBox ? -1 : 0}
          {...inputProps}
        />
        <ClearButtonComponent
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => dispatch(onClearValue(e))}
          hidden={!value || search === ''}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={joinTokens(`${id}_clear_button`, id)}
          className={classes('clear-button')}
          {...clearButtonProps}
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
                  value={{ ...context, group }}
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
              const { label, key, html, disabled, group } = option;
              const selected = focusedOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    className={classes('option', selected && 'focused', group && 'grouped')}
                    {...optionProps}
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
        <NotFoundComponent
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
          className={classes('not-found')}
          {...notFoundProps}
        >
          {showNotFound ? notFoundMessage : null}
        </NotFoundComponent>
      </WrapperComponent>
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
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  onValue: PropTypes.func,
  onChange: PropTypes.func,
  value: PropTypes.any,
  showSelectedLabel: PropTypes.bool,
  tabAutoComplete: PropTypes.bool,
  findAutoComplete: PropTypes.func,
  autoComplete: PropTypes.oneOf([false, true, 'inline']),
  classGenerator: PropTypes.func,
  busyDebounce: PropTypes.number,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,

  WrapperComponent: componentValidator,
  wrapperProps: PropTypes.object,
  InputComponent: componentValidator,
  inputProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  groupProps: PropTypes.object,
  GroupLabelComponent: componentValidator,
  groupLabelProps: PropTypes.object,
  OptionComponent: componentValidator,
  optionProps: PropTypes.object,
  ValueComponent: componentValidator,
  valueProps: PropTypes.object,
  ClearButtonComponent: componentValidator,
  clearButtonProps: PropTypes.object,
  NotFoundComponent: componentValidator,
  notFoundProps: PropTypes.object,
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

  onBlur: null,
  onFocus: null,

  WrapperComponent: 'div',
  wrapperProps: null,
  InputComponent: 'input',
  inputProps: null,
  ListBoxComponent: 'ul',
  listBoxProps: null,
  GroupComponent: Fragment,
  groupProps: null,
  GroupLabelComponent: 'li',
  groupLabelProps: null,
  OptionComponent: 'li',
  optionProps: null,
  ValueComponent: 'div',
  valueProps: null,
  ClearButtonComponent: 'span',
  clearButtonProps: null,
  NotFoundComponent: 'div',
  notFoundProps: null,
};

ComboBox.displayName = 'ComboBox';
