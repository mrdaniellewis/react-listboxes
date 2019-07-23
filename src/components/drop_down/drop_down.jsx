import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { clearSearch, setExpanded, onKeyDown, onClick } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makeSearch } from '../../helpers/make_search.js';

export function DropDown(rawProps) {
  const optionisedProps = useOptionisedProps(rawProps);
  const { options, value, setValue, valueIndex, blank, id, children } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, optionisedProps, initialState, id);
  const { expanded, search } = state;
  const activeId = value ? (value.id || `${id}_${valueIndex}`) : null;

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

  const searcher = useMemo(() => makeSearch(options), [options]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = searcher(search);
    if (found && found.length) {
      setValue(found[0]);
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [searcher, search, setValue]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <PopupButton
        ref={buttonRef}
        hasPopup="listbox"
        expanded={expanded}
        setExpanded={newExpanded => dispatch(setExpanded(newExpanded))}
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
        onBlur={onBlur}
        setValue={newValue => dispatch(onClick(newValue))}
        valueIndex={valueIndex}
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
