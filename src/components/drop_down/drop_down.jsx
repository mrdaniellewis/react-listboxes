import React, { useRef, useEffect, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { clearSearch, setExpanded, onKeyDown, onClick } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionised } from '../../hooks/use_optionised.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';

export function DropDown(props) {
  const { children, id, options: rawOptions, setValue, value, blank } = props;
  const options = useOptionised(rawOptions, blank);
  const [state, dispatch] = useReducer(reducer, { ...props, options }, initialState, id);
  const { expanded, search } = state;
  const currentOption = options.find(({ value: optionValue }) => optionValue === value);

  const buttonRef = useRef();
  const listRef = useRef();

  const onBlur = useOnBlur(() => dispatch(setExpanded(false)), listRef);

  useLayoutEffect(() => {
    const lastExpanded = expanded;
    const button = buttonRef.current;
    if (expanded) {
      listRef.current.focus();
    }
    return () => {
      if (lastExpanded) {
        button.focus();
      }
    };
  }, [expanded]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    // TODO: use searcher
    const found = options.find(option => (
      option.label.toLowerCase().startsWith(search.toLowerCase())
    ));
    if (found) {
      setValue(found.value);
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, setValue]);

  return (
    <Context.Provider value={{ ...props, expanded, options, setExpanded }}>
      <PopupButton
        ref={buttonRef}
        hasPopup="listbox"
        expanded={expanded}
        setExpanded={newExpanded => dispatch(setExpanded(newExpanded))}
        onKeyDown={e => dispatch(onKeyDown(e))}
      >
        {children || currentOption ? currentOption.label : blank}
      </PopupButton>
      <ListBox
        id={id}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onKeyDown={e => dispatch(onKeyDown(e))}
        onBlur={onBlur}
        setValue={newValue => dispatch(onClick(newValue))}
        value={value}
        blank={blank}
      />
    </Context.Provider>
  );
}

DropDown.propTypes = {
  blank: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  value: null,
};
