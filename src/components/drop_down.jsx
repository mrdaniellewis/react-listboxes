import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './drop_down/reducer.js';
import { initialState } from './drop_down/initial_state.js';
import {
  clearSearch, onKeyDown, onBlur,
  onToggleOpen, onFocus, onClick,
  onSelectValue, setFocusedOption, onOptionsChanged, onValueChanged,
} from './drop_down/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { componentValidator } from '../validators/component_validator.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';
import { findOption } from '../helpers/find_option.js';
import { extractProps } from '../helpers/extract_props.js';
import { ListBox } from './list_box.jsx';
import { classPrefix } from '../constants/class_prefix.js';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    'aria-labelledby': ariaLabelledBy,
    required, disabled,
    options, value, id, className,
    children, managedFocus, onLayoutListBox,
    selectedOption, findOption: currentFindOption,
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    ListBoxComponent, listBoxProps,
    WrapperComponent, wrapperProps,
    ComboBoxComponent, comboBoxProps,
  } = optionisedProps;
  const comboBoxRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, comboBoxRef, listRef },
    initialState,
  );

  const { expanded, search, focusedOption } = state;
  const [handleBlur, handleFocus] = useOnBlur(
    listRef,
    useCallback(() => {
      dispatch(onBlur());
      passedOnBlur?.();
    }, [passedOnBlur]),
    useCallback(() => {
      dispatch(onFocus());
      passedOnFocus?.();
    }, [passedOnFocus]),
  );

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
      comboBoxRef.current.focus();
    }
  }, [expanded, managedFocus, focusedOption]);

  useLayoutEffect(() => {
    if (onLayoutListBox) {
      onLayoutListBox({
        expanded,
        listbox: listRef.current,
        combobox: comboBoxRef.current,
        option: focusedRef.current,
      });
    }
  }, [onLayoutListBox, expanded, focusedOption]);

  const optionsCheck = options.length ? options : null;
  useLayoutEffect(() => {
    dispatch(onOptionsChanged());
  }, [optionsCheck]);

  const valueIdentity = value?.identity;
  useLayoutEffect(() => {
    dispatch(onValueChanged());
  }, [valueIdentity]);

  const combinedRef = useCombineRefs(comboBoxRef, ref);
  const context = {
    props: optionisedProps,
    expanded,
    currentOption: focusedOption,
  };
  const clickOption = useCallback((e, option) => dispatch(onClick(e, option)), []);

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        className={className}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={(e) => dispatch(onKeyDown(e))}
        {...wrapperProps}
      >
        <ComboBoxComponent
          role="combobox"
          id={id}
          className={`${classPrefix}dropdown__combobox`}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : null}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          aria-labelledby={ariaLabelledBy}
          aria-readonly="true"
          aria-required={required ? 'true' : null}
          aria-disabled={disabled ? 'true' : null}
          tabIndex={disabled ? null : 0}
          ref={combinedRef}
          onClick={(e) => dispatch(onToggleOpen(e))}
          onMouseDown={(e) => e.preventDefault()}
          {...comboBoxProps}
          {...extractProps(optionisedProps)}
        >
          {(children ?? value?.label ?? selectedOption?.label) || '\u00A0'}
        </ComboBoxComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          hidden={!expanded}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          tabIndex={-1}
          onSelectOption={clickOption}
          focusedRef={focusedRef}
          {...listBoxProps}
        />
      </WrapperComponent>
    </Context.Provider>
  );
});

DropDown.propTypes = {
  'aria-labelledby': PropTypes.string,
  'aria-invalid': PropTypes.string,
  blank: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  managedFocus: PropTypes.bool,
  skipOption: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  findOption: PropTypes.func,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onValue: PropTypes.func,
  onLayoutListBox: PropTypes.func,

  WrapperComponent: componentValidator,
  wrapperProps: PropTypes.object,
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  ListBoxListComponent: componentValidator,
  listBoxListProps: PropTypes.object,
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
  VisuallyHiddenComponent: componentValidator,
  visuallyHiddenProps: PropTypes.object,
};

DropDown.defaultProps = {
  'aria-labelledby': null,
  'aria-invalid': null,
  blank: '',
  className: `${classPrefix}dropdown`,
  children: null,
  value: null,
  managedFocus: true,
  skipOption: undefined,
  required: false,
  disabled: false,
  findOption,

  onBlur: null,
  onFocus: null,
  onValue: null,
  onLayoutListBox: null,

  WrapperComponent: 'div',
  wrapperProps: null,
  ListBoxComponent: ListBox,
  listBoxProps: null,
  ListBoxListComponent: 'ul',
  listBoxListProps: null,
  ComboBoxComponent: 'div',
  comboBoxProps: null,
  GroupComponent: Fragment,
  groupProps: null,
  GroupLabelComponent: 'li',
  groupLabelProps: null,
  OptionComponent: 'li',
  optionProps: null,
  ValueComponent: Fragment,
  valueProps: null,
  VisuallyHiddenComponent: 'div',
  visuallyHiddenProps: null,
};

DropDown.displayName = 'DropDown';
