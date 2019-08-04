import React, { useRef, useEffect, useLayoutEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { PopupButton } from '../popup_button.jsx';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { clearSearch, onKeyDown, onSelectValue, setSelectedValue, onBlur, onToggleOpen, onFocus, onButtonKeyDown } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makeSearch } from '../../helpers/make_search.js';
import { component } from '../../validators/component.js';

export function DropDown({
  ButtonComponent, ListBoxComponent, OptionComponent, GroupComponent, ValueComponent, ...rawProps
}) {
  const optionisedProps = useOptionisedProps(rawProps);
  const { options, value, valueIndex, setValue, blank, id, children } = optionisedProps;
  const buttonRef = useRef();
  const listRef = useRef();
  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, buttonRef },
    initialState,
    id,
  );
  const { expanded, search, selectedValue } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });

  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);

  useLayoutEffect(() => {
    if (expanded) {
      listRef.current.focus();
    }
  }, [expanded]);

  const searcher = useMemo(() => makeSearch(options), [options]);

  useEffect(() => {
    if (!search) {
      return undefined;
    }
    const found = searcher(search);
    if (found && found.length) {
      dispatch(setSelectedValue(found[0]));
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
        onKeyDown={e => dispatch(onButtonKeyDown(e))}
        ButtonComponent={ButtonComponent}
        id={id}
      >
        {children || (value && value.label) || blank}
      </PopupButton>
      <ListBox
        id={`${id}_listbox`}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onFocus={e => dispatch(onFocus(e))}
        onBlur={onBlurHandler}
        onKeyDown={e => dispatch(onKeyDown(e))}
        setValue={newValue => dispatch(onSelectValue(newValue))}
        valueIndex={valueIndex}
        selectedIndex={selectedIndex}
        blank={blank}
        aria-activedescendant={selectedIndex > -1 ? options[selectedIndex].id : null}
        ListBoxComponent={ListBoxComponent}
        OptionComponent={OptionComponent}
        GroupComponent={GroupComponent}
        ValueComponent={ValueComponent}
      />
    </Context.Provider>
  );
}

DropDown.propTypes = {
  blank: PropTypes.string,
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
  labelId: PropTypes.string,
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  ListBoxComponent: component,
  ButtonComponent: component,
  GroupComponent: component,
  OptionComponent: component,
  ValueComponent: component,
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  value: null,
  labelId: null,
  ListBoxComponent: undefined,
  ButtonComponent: undefined,
  GroupComponent: undefined,
  OptionComponent: undefined,
  ValueComponent: undefined,
};
