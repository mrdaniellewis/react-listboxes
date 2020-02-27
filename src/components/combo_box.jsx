import React, { useRef, useEffect, useLayoutEffect, Fragment, useMemo, forwardRef, useState, useCallback } from 'react';
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
import { extractProps } from '../helpers/extract_props.js';

const allowAttributes = [
  'autoCapitalize', 'disabled', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder', 'readOnly',
  'required', 'size', 'spellCheck',
];

export const ComboBox = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy, busyDebounce,
    options, value, selectedOption, id, className, classGenerator,
    notFoundMessage, layoutListBox, managedFocus, busy, onValue: _2, onSearch,
    autoselect, showSelectedLabel, findAutoselect: _3, tabAutocomplete: _4,
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
    if (layoutListBox && expanded) {
      const listProps = layoutListBox({
        listBox: listRef.current,
        comboBox: inputRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        setListProps({
          style: listProps.style || null,
          className: listProps.className || null,
        });
      }
    }
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

  const classes = classGenerator(className);
  const showNotFound = notFoundMessage && !busy && expanded && !options.length
    && search?.trim() && search !== value?.label;
  const ariaBusy = showBusy && search?.trim() && search !== (value?.label);
  const combinedRef = useCombineRefs(inputRef, ref);

  const context = { props: optionisedProps, state };

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        aria-busy={ariaBusy ? 'true' : 'false'}
        className={classes()}
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
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          ref={combinedRef}
          className={classes('input', expanded && 'focused')}
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
                  value={{ ...context, option, group }}
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
  tabAutocomplete: PropTypes.bool,
  findAutoselect: PropTypes.func,
  autoselect: PropTypes.oneOf([false, true, 'inline']),
  classGenerator: PropTypes.func,
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
  onBlur: null,
  onFocus: null,
  skipOption: undefined,

  autoselect: false,
  tabAutocomplete: false,
  findAutoselect: findOption,
  showSelectedLabel: undefined,

  classGenerator: bemClassGenerator,
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
  ValueComponent: 'div',
  valueProps: null,
  ClearButtonComponent: 'span',
  clearButtonProps: null,
  NotFoundComponent: 'div',
  notFoundProps: null,
};

ComboBox.displayName = 'ComboBox';
