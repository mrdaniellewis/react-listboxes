import React, { useRef, useEffect, useLayoutEffect, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from '../list_box.jsx';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setSelectedValue, onBlur, setButtonMouseDown,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
} from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makePrefixSearch } from '../../helpers/make_prefix_search.js';
import { component } from '../../validators/component.js';

export function DropDown({
  ButtonComponent, ListBoxComponent, OptionComponent,
  GroupComponent, ValueComponent, DropDownComponent, ...rawProps
}) {
  const optionisedProps = useOptionisedProps(rawProps);
  const {
    options, value, valueIndex, setValue, blank, id,
    children, managedFocus, ...componentProps
  } = optionisedProps;
  const buttonRef = useRef();
  const listRef = useRef();
  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, buttonRef, listRef },
    initialState,
    id,
  );
  const { expanded, search, selectedValue } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });

  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);
  const searcher = useMemo(() => makePrefixSearch(options), [options]);

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

  useLayoutEffect(() => {
    if (expanded && !(managedFocus && selectedValue)) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, selectedValue]);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <DropDownComponent
        {...componentProps}
      >
        <ButtonComponent
          type="button"
          id={id}
          aria-haspopup="listbox"
          aria-expanded={expanded ? 'true' : null}
          aria-controls={`${id}_listbox`}
          ref={buttonRef}
          onClick={() => dispatch(onToggleOpen())}
          onKeyDown={e => dispatch(onButtonKeyDown(e))}
        >
          {children || (value && value.label) || blank}
        </ButtonComponent>
        <ListBox
          id={`${id}_listbox`}
          options={options}
          hidden={!expanded}
          ref={listRef}
          onFocus={e => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={e => dispatch(onKeyDown(e))}
          setValue={newValue => dispatch(onClick(newValue))}
          valueIndex={valueIndex}
          selectedIndex={selectedIndex}
          blank={blank}
          aria-activedescendant={selectedIndex > -1 ? options[selectedIndex].id : null}
          managedFocus={managedFocus}
          expanded={expanded}
          ListBoxComponent={ListBoxComponent}
          OptionComponent={OptionComponent}
          GroupComponent={GroupComponent}
          ValueComponent={ValueComponent}
        />
      </DropDownComponent>
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
  managedFocus: PropTypes.bool,
  ListBoxComponent: component,
  ButtonComponent: component,
  GroupComponent: component,
  OptionComponent: component,
  ValueComponent: component,
  DropDownComponent: component,
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  value: null,
  managedFocus: true,
  ListBoxComponent: undefined,
  ButtonComponent: 'button',
  GroupComponent: undefined,
  OptionComponent: undefined,
  ValueComponent: undefined,
  DropDownComponent: Fragment,
};
