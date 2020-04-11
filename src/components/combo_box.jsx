import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './combo_box/reducer.js';
import { initialState } from './combo_box/initial_state.js';
import { onKeyDown, onChange, onFocus, onClearValue, onBlur, onClick, onOptionsChanged, onValueChanged } from './combo_box/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { componentValidator } from '../validators/component_validator.js';
import { findOption } from '../helpers/find_option.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';
import { extractProps } from '../helpers/extract_props.js';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name.js';
import { ListBox } from './list_box.jsx';
import { classPrefix } from '../constants/class_prefix.js';

const allowAttributes = [
  'autoCapitalize', 'disabled', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder', 'readOnly',
  'required', 'size', 'spellCheck',
];

export const ComboBox = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy, busyDebounce,
    options, value, selectedOption, id, className,
    notFoundMessage, layoutListBox, managedFocus, busy, onSearch,
    autoselect, showSelectedLabel,
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    WrapperComponent, wrapperProps,
    InputComponent, inputProps,
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

  const {
    expanded, focusedOption, search,
    focusListBox, inlineAutoselect,
  } = state;

  const [handleBlur, handleFocus] = useOnBlur(
    comboRef,
    useCallback(() => {
      dispatch(onBlur());
      passedOnBlur?.();
    }, [passedOnBlur]),
    useCallback(() => {
      dispatch(onFocus());
      passedOnFocus?.();
    }, [passedOnFocus]),
  );

  useLayoutEffect(() => {
    if (!layoutListBox) {
      return;
    }
    layoutListBox({
      listbox: listRef.current,
      combobox: inputRef.current,
      option: focusedRef.current,
      expanded,
    });
  }, [layoutListBox, expanded, focusedOption, options]);

  const searchValue = (search ?? value?.label) || '';
  useEffect(() => {
    if (onSearch) {
      onSearch(searchValue);
    }
  }, [onSearch, searchValue]);

  const inputLabel = useMemo(() => {
    if (inlineAutoselect
      || (((showSelectedLabel && !focusedOption?.unselectable) ?? autoselect === 'inline') && focusListBox)
    ) {
      return focusedOption?.label;
    }
    return search ?? value?.label;
  }, [
    inlineAutoselect, showSelectedLabel, autoselect,
    focusListBox, focusedOption, search, value,
  ]);

  useLayoutEffect(() => {
    if (search && autoselect === 'inline' && inlineAutoselect && focusedOption && document.activeElement === inputRef.current) {
      inputRef.current.setSelectionRange(search.length, focusedOption.label.length, 'backwards');
    }
  }, [inlineAutoselect, focusedOption, search, autoselect]);

  const ariaAutocomplete = useMemo(() => {
    if (autoselect === 'inline') {
      if (!onSearch) {
        return 'inline';
      }
      return 'both';
    }
    if (!onSearch) {
      return 'none';
    }
    return 'list';
  }, [onSearch, autoselect]);

  const optionsCheck = options.length ? options : null;
  useLayoutEffect(() => {
    dispatch(onOptionsChanged());
  }, [optionsCheck]);

  const valueIdentity = value?.identity;
  useLayoutEffect(() => {
    dispatch(onValueChanged());
  }, [valueIdentity]);

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
    if (busy && !busyDebounce) {
      setShowBusy(true);
    } else if (busy) {
      busyTimeoutRef.current = setTimeout(() => {
        setShowBusy(true);
      }, busyDebounce);
    } else {
      setShowBusy(false);
    }
    return () => {
      clearTimeout(busyTimeoutRef.current);
    };
  }, [busy, busyDebounce, busyTimeoutRef]);

  const showNotFound = notFoundMessage && busy === false && expanded && !options.length
    && search?.trim() && search !== value?.label;
  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);
  const context = {
    props: optionisedProps,
    state: { ...state, showListBox, showNotFound, ariaBusy },
  };
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);

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
          className={`${classPrefix}combobox__input`}
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
          onClick={(e) => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={combinedRef}
          tabIndex={managedFocus && showListBox && focusListBox ? -1 : null}
          {...inputProps}
          {...extractProps(optionisedProps, ...allowAttributes)}
        />
        <ClearButtonComponent
          id={`${id}_clear_button`}
          className={`${classPrefix}combobox__clear-button`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => dispatch(onClearValue(e))}
          hidden={!value || search === ''}
          aria-hidden="true"
          {...clearButtonProps}
        />
        <ListBox
          ref={listRef}
          id={`${id}_listbox`}
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={(showListBox && focusListBox && focusedOption?.key) || null}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
        />
        <NotFoundComponent
          id={`${id}_not_found`}
          className={`${classPrefix}combobox__not-found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
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
  busy: PropTypes.oneOf([false, true, null]),
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
  tabAutocomplete: PropTypes.bool,
  findAutoselect: PropTypes.func,
  autoselect: PropTypes.oneOf([false, true, 'inline']),
  busyDebounce: PropTypes.number,
  skipOption: PropTypes.func,
  searchOnFocus: PropTypes.bool,

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
  VisuallyHiddenComponent: componentValidator,
  visuallyHiddenProps: PropTypes.object,
};

ComboBox.defaultProps = {
  'aria-describedby': null,
  busy: false,
  busyDebounce: 200,
  className: `${classPrefix}combobox`,
  layoutListBox: null,
  managedFocus: true,
  notFoundMessage: 'No matches found',
  value: null,
  onSearch: null,
  onValue: null,
  onChange: null,
  onBlur: null,
  onFocus: null,
  skipOption: undefined,
  searchOnFocus: true,

  autoselect: false,
  tabAutocomplete: false,
  findAutoselect: findOption,
  showSelectedLabel: undefined,

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
  ValueComponent: Fragment,
  valueProps: null,
  ClearButtonComponent: 'span',
  clearButtonProps: null,
  NotFoundComponent: 'div',
  notFoundProps: null,
  VisuallyHiddenComponent: 'div',
  visuallyHiddenProps: { className: visuallyHiddenClassName },
};

ComboBox.displayName = 'ComboBox';
