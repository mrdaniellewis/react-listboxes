import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, onClick, onBlur, onClearValue, setExpanded, setSelected } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';

export function ComboBox(rawProps) {
  const optionisedProps = useOptionisedProps({ ...rawProps });
  const { options, value, id, busy } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, optionisedProps, initialState, id);
  const { expanded, search, listBoxFocused, selectedValue } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });
  const activeId = listBoxFocused && selectedIndex > -1 ? selectedValue.id : null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search && search.trim();
  const inputLabel = search !== null ? search : (value && value.label) || '';
  const showBusy = busy && search !== (value && value.value);

  const comboRef = useRef();
  const inputRef = useRef();

  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  useEffect(() => {
    dispatch(setSelected(value));
  }, [value]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <div
        role="combobox"
        aria-labelledby={id}
        aria-haspopup="listbox"
        aria-expanded={showListBox ? 'true' : 'false'}
        aria-owns={`${id} ${id}_list_box`}
        aria-busy={showBusy ? 'true' : 'false'}
        onBlur={blur}
        ref={comboRef}
      >
        <span
          className="spinner"
          hidden={!showBusy}
        />
        <input
          id={id}
          type="text"
          aria-controls={`${id}_list_box`}
          aria-activedescendant={activeId}
          value={inputLabel}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={showNotFound ? `${id}_not_found` : ''}
          ref={inputRef}
        />
        <button
          type="button"
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            inputRef.current.focus();
            dispatch(onClearValue());
          }}
          hidden={!value}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={`${id}_clear_button ${id}`}
        >
          ×
        </button>
        <span
          onMouseDown={e => e.preventDefault()}
          onClick={() => {
            inputRef.current.focus();
            dispatch(setExpanded(true));
          }}
          aria-hidden="true"
        >
          ▼
        </span>
        <ListBox
          id={`${id}_list_box`}
          options={options}
          hidden={!showListBox}
          setValue={newValue => dispatch(onClick(newValue))}
          valueIndex={selectedIndex}
          onMouseDown={e => e.preventDefault()}
        />
        <div
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
        >
          Nothing found
        </div>
        <div
          id={`${id}_info`}
          hidden={true}
        >
        </div>
      </div>
    </Context.Provider>
  );
}

ComboBox.propTypes = {
  busy: PropTypes.bool,
  id: PropTypes.string.isRequired,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  onSearch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ComboBox.defaultProps = {
  busy: null,
  value: null,
};
