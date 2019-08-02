import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
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
import { component } from '../../validators/component.js';

export function ComboBox({
  ComboBoxComponent, OptionComponent, GroupComponent, ListBoxComponent, InputComponent,
  SpinnerComponent, NotFoundComponent, InfoDescriptionComponent, ClearButtonComponent,
  OpenButtonComponent, ValueComponent, ...rawProps
}) {
  const optionisedProps = useOptionisedProps({ ...rawProps });
  const { notFoundMessage, options, value, id, busy } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, optionisedProps, initialState, id);
  const { expanded, search, listBoxFocused, selectedValue } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });
  const activeId = listBoxFocused && selectedIndex > -1 ? selectedValue.id : null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search && search.trim();
  const inputLabel = search !== null ? search : (value && value.label) || '';
  const showBusy = busy && search !== (value && value.label);

  const comboRef = useRef();
  const inputRef = useRef();

  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  useEffect(() => {
    dispatch(setSelected(value));
  }, [value]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <ComboBoxComponent
        onBlur={blur}
        ref={comboRef}
        aria-busy={showBusy ? 'true' : 'false'}
      >
        <SpinnerComponent
          className="spinner"
          hidden={!showBusy}
        />
        <InputComponent
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="list"
          aria-controls={`${id}_list_box`}
          aria-haspopup="true"
          aria-owns={`${id}_list_box`}
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={activeId}
          value={inputLabel}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, `${id}_info`)}
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
          options={options}
          hidden={!showListBox}
          setValue={newValue => dispatch(onSelectValue(newValue))}
          valueIndex={selectedIndex}
          onMouseDown={e => e.preventDefault()}
          ListBoxComponent={ListBoxComponent}
          OptionComponent={OptionComponent}
          GroupComponent={GroupComponent}
          ValueComponent={ValueComponent}
        />
        <NotFoundComponent
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
        >
          {notFoundMessage}
        </NotFoundComponent>
        <InfoDescriptionComponent
          id={`${id}_info`}
          hidden
        >
          {options.length && showListBox && (
            `Found ${options.length} options`
          )}
        </InfoDescriptionComponent>
      </ComboBoxComponent>
    </Context.Provider>
  );
}

ComboBox.propTypes = {
  busy: PropTypes.bool,
  id: PropTypes.string.isRequired,
  notFoundMessage: PropTypes.node,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onSearch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  ComboBoxComponent: component,
  InputComponent: component,
  SpinnerComponent: component,
  NotFoundComponent: component,
  InfoDescriptionComponent: component,
  ClearButtonComponent: component,
  OpenButtonComponent: component,
  OptionComponent: component,
  GroupComponent: component,
  ListBoxComponent: component,
  ValueComponent: component,
};

ComboBox.defaultProps = {
  busy: null,
  notFoundMessage: 'No matches found',
  value: null,
  ComboBoxComponent: 'div',
  InputComponent: 'input',
  SpinnerComponent: 'span',
  NotFoundComponent: 'div',
  InfoDescriptionComponent: 'div',
  ClearButtonComponent: 'button',
  OpenButtonComponent: 'span',
  OptionComponent: undefined,
  GroupComponent: undefined,
  ListBoxComponent: undefined,
  ValueComponent: undefined,
};
