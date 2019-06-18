import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { setExpanded } from './actions.js';
import { Context } from '../../context.js';

export function DropDown({ id, ...props }) {
  const [state, dispatch] = useThunkReducer(reducer, props, initialState, id);

  const buttonRef = useRef();
  const listRef = useRef();

  function onBlur() {
    setTimeout(() => {
      if (!listRef.current.contains(document.activeElement)) {
        setExpanded(false);
        buttonRef.current.focus();
      }
    }, 0);
  }

  const { expanded } = state;

  return (
    <Context.Provider value={{ ...props, ...state, dispatch }}>
      <PopupButton
        ref={buttonRef}
        hasPopup="listbox"
        setExpanded={setExpanded}
      >
        button
      </PopupButton>
      <ListBox
        id={id}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onKeyDown={() => {}}
        onChange={() => {}}
        onBlur={onBlur}
      />
    </Context.Provider>
  );
}
