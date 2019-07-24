import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { clearSearch, onKeyDown, onClick, setSelectedIndex, onBlur, onToggleOpen } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makeSearch } from '../../helpers/make_search.js';

export function DropDown(rawProps) {
  const optionisedProps = useOptionisedProps(rawProps);
  const { options, value, setValue, blank, id, children } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, optionisedProps, initialState, id);
  const { expanded, search, selectedIndex } = state;
  const activeOption = selectedIndex > -1 ? options[selectedIndex] : null;
  const activeId = activeOption ? activeOption.id || `${id}_${selectedIndex}` : null;

  const buttonRef = useRef();
  const listRef = useRef();

  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);

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

  const searcher = useMemo(() => makeSearch(options), [options]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = searcher(search);
    if (found && found.length) {
      dispatch(setSelectedIndex(options.findIndex(o => o.value === found.value)));
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, searcher, search, setValue]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <PopupButton
        ref={buttonRef}
        hasPopup="listbox"
        expanded={expanded}
        setExpanded={newExpanded => dispatch(onToggleOpen(newExpanded))}
        onKeyDown={e => dispatch(onKeyDown(e))}
      >
        {children || (value && value.label) || blank}
      </PopupButton>
      <ListBox
        id={id}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onKeyDown={e => dispatch(onKeyDown(e))}
        onBlur={onBlurHandler}
        setValue={newValue => dispatch(onClick(newValue))}
        valueIndex={selectedIndex}
        blank={blank}
        aria-activedescendant={activeId}
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
