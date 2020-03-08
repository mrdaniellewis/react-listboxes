import React, { useRef, useEffect, useLayoutEffect, Fragment, forwardRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { useThunkReducer as useReducer } from '../hooks/use_thunk_reducer.js';
import { reducer } from './drop_down/reducer.js';
import { initialState } from './drop_down/initial_state.js';
import {
  clearSearch, onKeyDown, onBlur,
  onToggleOpen, onFocus, onClick,
  onSelectValue, setFocusedOption, onOptionsChanged,
} from './drop_down/actions.js';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { useOnBlur } from '../hooks/use_on_blur.js';
import { componentValidator } from '../validators/component_validator.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { useCombineRefs } from '../hooks/use_combine_refs.js';
import { findOption } from '../helpers/find_option.js';
import { extractProps } from '../helpers/extract_props.js';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name.js';

export const DropDown = forwardRef((rawProps, ref) => {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    'aria-labelledby': ariaLabelledBy,
    required, disabled,
    options, value, id,
    children, managedFocus, layoutListBox,
    selectedOption, findOption: currentFindOption,
    onBlur: passedOnBlur, onFocus: passedOnFocus,
    WrapperComponent, wrapperProps,
    ComboBoxComponent, comboBoxProps,
    ListBoxComponent, listBoxProps,
    GroupComponent, groupProps,
    GroupLabelComponent, groupLabelProps,
    OptionComponent, optionProps,
    ValueComponent, valueProps,
    classNames,
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
    if (layoutListBox) {
      layoutListBox({
        expanded,
        listbox: listRef.current,
        combobox: comboBoxRef.current,
        option: focusedRef.current,
      });
    }
  }, [layoutListBox, expanded, focusedOption]);

  useLayoutEffect(() => {
    dispatch(onOptionsChanged());
  }, [options]);

  const combinedRef = useCombineRefs(comboBoxRef, ref);

  const context = { props: optionisedProps, state };

  return (
    <Context.Provider value={context}>
      <WrapperComponent
        className={classNames?.wrapper}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onKeyDown={(e) => dispatch(onKeyDown(e))}
        {...wrapperProps}
      >
        <ComboBoxComponent
          role="combobox"
          id={id}
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
          className={classNames?.combobox}
          {...comboBoxProps}
          {...extractProps(optionisedProps)}
        >
          {(children ?? value?.label ?? selectedOption?.label) || '\u00A0'}
        </ComboBoxComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          hidden={!expanded}
          aria-activedescendant={(expanded && focusedOption?.key) || null}
          tabIndex={-1}
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
              const { label, key, html, disabled: optionDisabled, group } = option;
              const selected = focusedOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, group, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={optionDisabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    className={classNames?.[`option${selected ? 'Selected' : ''}${group ? 'Grouped' : ''}`]}
                    {...optionProps}
                    {...html}
                    onClick={optionDisabled ? null : (e) => dispatch(onClick(e, option))}
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
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  managedFocus: PropTypes.bool,
  className: PropTypes.string,
  skipOption: PropTypes.func,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  findOption: PropTypes.func,

  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onValue: PropTypes.func,

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

  classNames: PropTypes.shape({
    wrapper: PropTypes.string,
    combobox: PropTypes.string,
    listbox: PropTypes.string,
    groupLabel: PropTypes.string,
    option: PropTypes.string,
    optionSelected: PropTypes.string,
    optionGrouped: PropTypes.string,
    optionGroupedSelected: PropTypes.string,
    visuallyHidden: PropTypes.string,
  }),
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
  skipOption: undefined,
  required: false,
  disabled: false,
  findOption,

  onBlur: null,
  onFocus: null,
  onValue: null,

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

  classNames: {
    wrapper: 'dropdown',
    combobox: 'dropdown__combobox',
    listbox: 'dropdown__listbox',
    groupLabel: 'dropdown__group',
    option: 'dropdown__option',
    optionSelected: 'dropdown__option',
    optionGrouped: 'dropdown__option dropdown__option_grouped',
    optionSelectedGrouped: 'dropdown__option dropdown__option_grouped',
    visuallyHidden: visuallyHiddenClassName,
  },
};

DropDown.displayName = 'DropDown';
