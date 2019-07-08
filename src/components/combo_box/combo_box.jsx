import React, { useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { setExpanded, onKeyDown, onChange } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionised } from '../../hooks/use_optionised.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';

export function ComboBox(props) {
  const { id, options: rawOptions, setValue, value } = props;
  const options = useOptionised(rawOptions);
  const [state, dispatch] = useReducer(reducer, { ...props, options }, initialState, id);
  const { expanded, search } = state;

  const inputRef = useRef();
  const listRef = useRef();
  const onBlur = useOnBlur(() => dispatch(setExpanded(false)), listRef);

  const valueIndex = options.findIndex(option => option.value === value);
  const activeId = valueIndex > -1 ? options[valueIndex].id || `${id}_${valueIndex}` : null;

  return (
    <Context.Provider value={{ ...props, expanded, options, setExpanded }}>
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={expanded ? 'true' : 'false'}
        aria-owns={`${id}_list_box`}
        aria-busy={busy ? 'true' : 'false'}
        onBlur={onBlur}
      >
        <input
          id={id}
          type="text"
          aria-autocomplete="list"
          aria-controls={`${id}_list_box`}
          aria-activedescendant={activeId}
          value={search}
          ref={inputRef}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={`${id}_not_found`}
        />
        <ListBox
          id={`${id}_list_box`}
          options={options}
          hidden={!expanded}
          ref={listRef}
          setValue={newValue => setValue(newValue)}
          value={value}
        />
        <div
          id={`${id}_not_found`}
          hidden={expanded && !(!busy && search && !options.length)}
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
  setValue: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

ComboBox.defaultProps = {
  busy: null,
  value: null,
};
