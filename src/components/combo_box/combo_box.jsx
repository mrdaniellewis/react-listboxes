import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, setSearch, onClick, onBlur, onClearValue } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionised } from '../../hooks/use_optionised.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';

export function ComboBox(props) {
  const { id, options: rawOptions, value, busy } = props;
  const options = useOptionised(rawOptions);
  const [state, dispatch] = useReducer(reducer, { ...props, options }, initialState, id);
  const { expanded, search } = state;

  const comboRef = useRef();
  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  useEffect(() => {
    dispatch(setSearch(null));
  }, [value]);

  const valueIndex = options.findIndex(option => option.value === value);
  const option = options[valueIndex];
  const activeId = valueIndex > -1 ? options[valueIndex].id || `${id}_${valueIndex}` : null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search && search.trim();
  const inputLabel = search !== null ? search : (option && option.label) || '';

  return (
    <Context.Provider value={{ ...props, ...state, options }}>
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
        <span
          onClick={() => dispatch(onClearValue())}
          hidden={!value}
        >
          ×
        </span>
        <ListBox
          id={`${id}_list_box`}
          options={options}
          hidden={!showListBox}
          setValue={newValue => dispatch(onClick(newValue))}
          value={value}
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
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
};

ComboBox.defaultProps = {
  busy: null,
  value: null,
};
