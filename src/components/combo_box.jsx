import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './combo_box/reducer.js';
import { initialState } from './combo_box/initial_state.js';
import { onKeyDown, onChange, onFocus, onClearValue, onBlur, onClick, onOptionsChanged, onFocusInput } from './combo_box/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { joinTokens } from '../helpers/join_tokens.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { findOption } from '../helpers/find_option.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';
import { extractProps } from '../helpers/extract_props.js';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name.js';

const allowAttributes = [
  'autoCapitalize', 'disabled', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder', 'readOnly',
  'required', 'size', 'spellCheck',
];

export const ComboBox = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy, busyDebounce,
    options, value, selectedOption, id,
    notFoundMessage, layoutListBox, managedFocus, busy, onSearch,
    autoselect, showSelectedLabel,
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
    classNames,
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

  const context = { props: optionisedProps, state };

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        aria-busy={ariaBusy ? 'true' : 'false'}
        className={classNames?.wrapper}
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
          onFocus={() => dispatch(onFocusInput())}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={combinedRef}
          className={classNames?.input}
          tabIndex={managedFocus && showListBox && focusListBox ? -1 : 0}
          {...inputProps}
          {...extractProps(optionisedProps, ...allowAttributes)}
        />
        <ClearButtonComponent
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => dispatch(onClearValue(e))}
          hidden={!value || search === ''}
          id={`${id}_clear_button`}
          aria-hidden="true"
          className={classNames?.clearButton}
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
          className={classNames?.listbox}
          {...listBoxProps}
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
                      className={classNames?.groupLabel}
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
                  value={{ ...context, selected, option, group }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    className={classNames?.[`option${selected ? 'Selected' : ''}${group ? 'Grouped' : ''}`]}
                    {...optionProps}
                    {...html}
                    onClick={disabled ? null : (e) => dispatch(onClick(e, option))}
                  >
                    {group && (
                      <div className={classNames?.visuallyHidden}>
                        {group.label}
                      </div>
                    )}
                    <ValueComponent {...valueProps}>
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
          className={classNames?.notFound}
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

  classNames: PropTypes.shape({
    wrapper: PropTypes.string,
    input: PropTypes.string,
    listbox: PropTypes.string,
    groupLabel: PropTypes.string,
    option: PropTypes.string,
    optionSelected: PropTypes.string,
    optionGrouped: PropTypes.string,
    optionGroupedSelected: PropTypes.string,
    notFound: PropTypes.string,
    clearButton: PropTypes.string,
    visuallyHidden: PropTypes.string,
  }),
};

ComboBox.defaultProps = {
  'aria-describedby': null,
  busy: false,
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

  autoselect: false,
  tabAutocomplete: false,
  findAutoselect: findOption,
  showSelectedLabel: undefined,

  busyDebounce: 200,

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

  classNames: {
    wrapper: 'combobox',
    input: 'combobox__input',
    listbox: 'combobox__listbox',
    groupLabel: 'combobox__group',
    option: 'combobox__option',
    optionSelected: 'combobox__option',
    optionGrouped: 'combobox__option combobox__option_grouped',
    optionSelectedGrouped: 'combobox__option combobox__option_grouped',
    notFound: 'combobox__not-found',
    clearButton: 'combobox__clear-button',
    visuallyHidden: visuallyHiddenClassName,
  },
};

ComboBox.displayName = 'ComboBox';
