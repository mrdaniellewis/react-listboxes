import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, onClick, onBlur, onClearValue } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';

export function ComboBox(rawProps) {
  const optionisedProps = useOptionisedProps({ ...rawProps });
  const { options, value, id, busy } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, optionisedProps, initialState, id);
  const { expanded, search, listBoxFocused, selectedIndex } = state;
  const activeOption = selectedIndex > -1 ? options[selectedIndex] : null;
  const activeId = activeOption && listBoxFocused ? activeOption.id || `${id}_${selectedIndex}` : null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search && search.trim();
  const inputLabel = search !== null ? search : (value && value.label) || '';

  const comboRef = useRef();
  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={showListBox ? 'true' : 'false'}
        aria-owns={`${id}_list_box`}
        aria-busy={busy ? 'true' : 'false'}
        onBlur={blur}
        ref={comboRef}
      >
        <input
          id={id}
          type="text"
          aria-autocomplete="list"
          aria-controls={`${id}_list_box`}
          aria-activedescendant={activeId}
          value={inputLabel}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={showNotFound ? `${id}_not_found` : ''}
        />
        <button
          type="button"
          onClick={() => dispatch(onClearValue())}
          hidden={!value}
        >
          ×
        </button>
        <ListBox
          id={`${id}_list_box`}
          options={options}
          hidden={!showListBox}
          setValue={newValue => dispatch(onClick(newValue))}
          aria-activedescendant={activeId}
          valueIndex={selectedIndex}
        />
        <div
          id={`${id}_not_found`}
          hidden={!showNotFound}
        >
          Nothing found
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
