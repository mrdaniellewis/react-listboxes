import React, { useRef, useEffect, useLayoutEffect, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setSelectedValue, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
} from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useOptionisedProps } from '../../hooks/use_optionised_props.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makePrefixSearch } from '../../helpers/make_prefix_search.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { GROUP } from '../../constants/group.js';

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
  const selectedRef = useRef();

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
    if (expanded && selectedRef.current && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded && !(managedFocus && selectedValue)) {
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
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          tabIndex={-1}
          hidden={!expanded}
          aria-activedescendant={selectedIndex > -1 ? options[selectedIndex].id : null}
          onFocus={e => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={e => dispatch(onKeyDown(e))}
        >
          {options.map((option, i) => {
            const {
              id: optionId, index, label, key, disabled, node, data: _1, onClick: _2, ...more
            } = option;

            return (
              <Context.Provider
                key={key || i}
                value={{ dispatch, ...optionisedProps, ...state, option }}
              >
                {option.value === GROUP
                  ? (
                    <GroupComponent>
                      {option.label}
                    </GroupComponent>
                  )
                  : (
                    <OptionComponent
                      id={optionId}
                      role="option"
                      tabIndex={-1}
                      aria-selected={index === valueIndex ? 'true' : null}
                      aria-disabled={disabled ? 'true' : null}
                      data-focused={index === selectedIndex ? 'true' : null}
                      ref={index === selectedIndex ? selectedRef : null}
                      onClick={disabled ? null : e => onClick(e, option)}
                      {...more}
                    >
                      <ValueComponent>
                        {node || label}
                      </ValueComponent>
                    </OptionComponent>
                  )
                }
              </Context.Provider>
            );
          })}
        </ListBoxComponent>
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
  ListBoxComponent: componentCustomiser,
  ButtonComponent: componentCustomiser,
  GroupComponent: componentCustomiser,
  OptionComponent: componentCustomiser,
  ValueComponent: componentCustomiser,
  DropDownComponent: componentCustomiser,
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  value: null,
  managedFocus: true,
  ListBoxComponent: 'ul',
  ButtonComponent: 'button',
  GroupComponent: 'li',
  OptionComponent: 'li',
  ValueComponent: Fragment,
  DropDownComponent: Fragment,
};
