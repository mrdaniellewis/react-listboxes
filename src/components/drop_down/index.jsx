import React, { useRef, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { clearSearch, setExpanded } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { optionise } from '../../helpers/optionise.js';

export function DropDown(props) {
  const { id, options: rawOptions, setValue } = props;
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);
  const [state, dispatch] = useReducer(reducer, props, initialState, id);
  const { expanded, search } = state;

  const buttonRef = useRef();
  const listRef = useRef();

  function onBlur() {
    setTimeout(() => {
      if (!listRef.current.contains(document.activeElement)) {
        dispatch(setExpanded(false));
        buttonRef.current.focus();
      }
    }, 0);
  }

  useEffect(() => {
    const found = options.find(option => option.label.startsWith(search));
    setValue(found.value);
    // TODO: Need to debouce this
    setTimeout(() => dispatch(clearSearch()), 1000);
  }, [search]);

  return (
    <Context.Provider value={{ ...props, expanded, options, setExpanded }}>
      <PopupButton
        ref={buttonRef}
        hasPopup="listbox"
        setExpanded={setExpanded}
      >
        {children || label}
      </PopupButton>
      <ListBox
        id={id}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onKeyDown={e => dispatch(onKeyDown(e))}
        onBlur={onBlur}
        setValue={newValue => setValue(newValue)}
        value={value}
      />
    </Context.Provider>
  );
}

DropDown.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.object, // eslint-disable-line react/forbid-prop-types
};

DropDown.defaultProps = {
  children: null,
  value: null,
};
