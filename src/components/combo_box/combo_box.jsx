import React, { useRef, useLayoutEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, onSelectValue, onBlur, setExpanded, setSelected } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { joinTokens } from '../../helpers/join_tokens.js';
import { componentValidator } from '../../validators/component_validator.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';
import { usePrevious } from '../../hooks/use_previous.js';
import { classGenerator } from '../../helpers/class_generator.js';

export function ComboBox(rawProps) {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    'aria-describedby': ariaDescribedBy,
    options, value, setValue, id, className,
    notFoundMessage, layoutListBox, managedFocus, busy,
    ClearButtonComponent, ClearButtonProps,
    ComboBoxComponent, ComboBoxProps,
    GroupComponent, GroupProps,
    InputComponent, InputProps,
    ListBoxComponent, ListBoxProps,
    NotFoundComponent, NotFoundProps,
    OpenButtonComponent, OpenButtonProps,
    OptionComponent, OptionProps,
    SpinnerComponent, SpinnerProps,
    ValueComponent, ValueProps,
    ...componentProps
  } = optionisedProps;

  const comboRef = useRef();
  const inputRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, inputRef, listRef },
    initialState,
    id,
  );

  const { expanded, focusedIndex, search, listClassName, listStyle } = state;
  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  const prevOptions = usePrevious(options);
  useLayoutEffect(() => {
    if (prevOptions && prevOptions !== options) {
      dispatch(onOptionsChanged(prevOptions));
    }
  }, [prevOptions, options]);

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
        listbox: listRef.current,
        input: inputRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        dispatch(setListProps(listProps));
      }
    }
  }, [layoutListBox, expanded, focusedIndex, options]);

  const classes = classGenerator(className);
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search?.trim();
  const inputLabel = search !== null ? search : (value?.label) || '';
  const showBusy = busy && search !== (value?.label);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <ComboBoxComponent
        aria-busy={showBusy ? 'true' : 'false'}
        className={className}
        onBlur={blur}
        ref={comboRef}
        {...ComboBoxProps}
        {...componentProps}
      >
        <SpinnerComponent
          className={className ? `${className}__spinner` : null}
          hidden={!showBusy}
          {...SpinnerProps}
        />
        <InputComponent
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-owns={`${id}_listbox`}
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={options[focusedIndex]?.key || null}
          data-focused={focused ? 'true' : null}
          value={inputLabel}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onChange={(e) => dispatch(onChange(e))}
          onFocus={(e) => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, ariaDescribedBy)}
          autoComplete="off"
          ref={inputRef}
          className={className ? `${className}__input` : null}
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
          hidden={!value}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={joinTokens(`${id}_clear_button`, id)}
          className={className ? `${className}__clear-button` : null}
          {...ClearButtonProps}
        >
          ×
        </ClearButtonComponent>
        <OpenButtonComponent
          onMouseDown={(e) => e.preventDefault()}
          onClick={(e) => {
            if (e.button > 0) {
              return;
            }
            inputRef.current.focus();
            dispatch(setExpanded(true));
          }}
          aria-hidden="true"
          className={className ? `${className}__open-button` : null}
          {...OpenButtonProps}
        >
          ▼
        </OpenButtonComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={options[focusedIndex]?.id ?? null}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          onMouseDown={(e) => e.preventDefault()}
          className={className ? `${className}__listbox` : null}
          {...ListBoxProps}
          style={listStyle}
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
                  <GroupComponent
                    id={key}
                    ref={index === focusedIndex ? focusedRef : null}
                    role="group"
                    aria-label={label}
                    tabIndex={-1}
                    aria-disabled="true"
                    className={className ? `${className}__listbox__group` : null}
                    {...GroupProps}
                    {...html}
                  >
                    {label}
                  </GroupComponent>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, html, disabled, index, selected } = option;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={index === focusedIndex ? focusedRef : null}
                    className={className ? `${className}__listbox__option` : null}
                    {...OptionProps}
                    {...html}
                    onClick={disabled ? null : () => dispatch(onSelectValue(option))}
                  >
                    <ValueComponent
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
          className={className ? `${className}__not-found` : null}
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
  onSearch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.any,

  ClearButtonComponent: componentValidator,
  ClearButtonProps: PropTypes.object,
  ComboBoxComponent: componentValidator,
  ComboBoxProps: PropTypes.object,
  GroupComponent: componentValidator,
  GroupProps: PropTypes.object,
  InputComponent: componentValidator,
  InputProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  ListBoxProps: PropTypes.object,
  NotFoundComponent: componentValidator,
  NotFoundProps: PropTypes.object,
  OpenButtonComponent: componentValidator,
  OpenButtonProps: PropTypes.object,
  OptionComponent: componentValidator,
  OptionProps: PropTypes.object,
  SpinnerComponent: componentValidator,
  SpinnerProps: PropTypes.object,
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

  ClearButtonComponent: 'span',
  ClearButtonProps: null,
  ComboBoxComponent: 'div',
  ComboBoxProps: null,
  GroupComponent: 'li',
  GroupProps: null,
  InputComponent: 'input',
  InputProps: null,
  ListBoxComponent: 'ul',
  ListBoxProps: null,
  NotFoundComponent: 'div',
  NotFoundProps: null,
  OpenButtonComponent: 'span',
  OpenButtonProps: null,
  OptionComponent: 'li',
  OptionProps: null,
  SpinnerComponent: 'span',
  SpinnerProps: null,
  ValueComponent: Fragment,
  ValueProps: null,
};
