import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, onSelectValue, onBlur, setExpanded, setSelected } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { joinTokens } from '../../helpers/join_tokens.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { ListBox } from '../list_box.jsx';

export function ComboBox({
  ComboBoxComponent, OptionComponent, GroupComponent, ListBoxComponent, InputComponent,
  SpinnerComponent, NotFoundComponent, DescriptionComponent, ClearButtonComponent,
  OpenButtonComponent, ValueComponent, ...rawProps
}) {
  const comboRef = useRef();
  const inputRef = useRef();
  const optionisedProps = useOptionisedProps({ ...rawProps });
  const {
    notFoundMessage, options, value, valueIndex, id, busy, managedFocus,
    className, setValue: _1, onSearch: _2, ...componentProps
  } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, { ...optionisedProps, inputRef }, initialState, id);
  const { expanded, search, listBoxFocused, selectedValue, focused } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });

  const activeId = listBoxFocused && selectedIndex > -1 ? selectedValue.id : null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search && search.trim();
  const inputLabel = search !== null ? search : (value && value.label) || '';
  const showBusy = busy && search !== (value && value.label);

  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  useEffect(() => {
    dispatch(setSelected(value));
  }, [value]);

  useEffect(() => {
    if (managedFocus && !listBoxFocused && focused) {
      inputRef.current.focus();
    }
  }, [listBoxFocused, focused, managedFocus]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <ComboBoxComponent
        aria-busy={showBusy ? 'true' : 'false'}
        className={className}
        onBlur={blur}
        ref={comboRef}
        {...componentProps}
      >
        <SpinnerComponent
          className="spinner"
          hidden={!showBusy}
        />
        <InputComponent
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-owns={`${id}_list_box`}
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={activeId}
          data-focused={focused ? 'true' : null}
          value={inputLabel}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, `${id}_info`)}
          autoComplete="off"
          ref={inputRef}
        />
        <ClearButtonComponent
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            inputRef.current.focus();
            dispatch(onSelectValue(null));
          }}
          hidden={!value}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={`${id}_clear_button ${id}`}
        >
          ×
        </ClearButtonComponent>
        <OpenButtonComponent
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            inputRef.current.focus();
            dispatch(setExpanded(true));
          }}
          aria-hidden="true"
        >
          ▼
        </OpenButtonComponent>
        <ListBox
          id={`${id}_list_box`}
          expanded={expanded}
          options={options}
          hidden={!showListBox}
          setValue={newValue => dispatch(onSelectValue(newValue))}
          valueIndex={valueIndex}
          selectedIndex={selectedIndex}
          onMouseDown={e => e.preventDefault()}
          ListBoxComponent={ListBoxComponent}
          OptionComponent={OptionComponent}
          GroupComponent={GroupComponent}
          ValueComponent={ValueComponent}
          onKeyDown={e => dispatch(onKeyDown(e))}
          managedFocus={managedFocus && listBoxFocused}
        />
        <NotFoundComponent
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
        >
          {notFoundMessage}
        </NotFoundComponent>
        <DescriptionComponent
          id={`${id}_info`}
          hidden
        >
          {options.length && showListBox && (
            `Found ${options.length} options`
          )}
        </DescriptionComponent>
      </ComboBoxComponent>
    </Context.Provider>
  );
}

ComboBox.propTypes = {
  busy: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  managedFocus: PropTypes.bool,
  notFoundMessage: PropTypes.node,
  onSearch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types

  ClearButtonComponent: componentCustomiser,
  ComboBoxComponent: componentCustomiser,
  GroupComponent: componentCustomiser,
  DescriptionComponent: componentCustomiser,
  InputComponent: componentCustomiser,
  ListBoxComponent: componentCustomiser,
  NotFoundComponent: componentCustomiser,
  OpenButtonComponent: componentCustomiser,
  OptionComponent: componentCustomiser,
  SpinnerComponent: componentCustomiser,
  ValueComponent: componentCustomiser,
};

ComboBox.defaultProps = {
  busy: null,
  className: 'combobox',
  managedFocus: true,
  notFoundMessage: 'No matches found',
  value: null,

  ClearButtonComponent: 'button',
  ComboBoxComponent: 'div',
  GroupComponent: undefined,
  DescriptionComponent: 'div',
  InputComponent: 'input',
  ListBoxComponent: undefined,
  NotFoundComponent: 'div',
  OpenButtonComponent: 'span',
  OptionComponent: undefined,
  SpinnerComponent: 'span',
  ValueComponent: undefined,
};
