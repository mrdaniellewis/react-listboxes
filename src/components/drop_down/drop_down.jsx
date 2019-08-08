import React, { useRef, useEffect, useLayoutEffect, useMemo, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { usePrevious } from '../../hooks/use_previous.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setSelectedValue, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
} from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useGroupedOptions } from '../../hooks/use_grouped_options.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makePrefixSearch } from '../../helpers/make_prefix_search.js';
import { componentCustomiser } from '../../validators/component_customiser.js';

export function DropDown({
  ButtonComponent, ListBoxComponent, OptionComponent,
  GroupComponent, ValueComponent, DropDownComponent, ...rawProps
}) {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    options, value, setValue, blank, id,
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

  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);
  const searcher = useMemo(() => makePrefixSearch(options), [options]);
  const selectedIndex = useSelectedIndex({ options, selectedValue });

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

  const groupedOptions = useGroupedOptions(options);

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
          {groupedOptions.map((group) => {
            const optionNodes = group.options.map((option) => {
              const {
                label, index, key, disabled, node, selected, data: _1, ...more
              } = option;

              console.log(key);

              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, option }}
                >
                  <OptionComponent
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    data-focused={index === selectedIndex ? 'true' : null}
                    ref={index === selectedIndex ? selectedRef : null}
                    {...more}
                    onClick={disabled ? null : e => onClick(e, option)}
                  >
                    <ValueComponent>
                      {node ?? label}
                    </ValueComponent>
                  </OptionComponent>
                </Context.Provider>
              );
            });

            if (group.label) {
              const { key, label, node, ...more } = group;
              console.log(key, group);
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, group }}
                >
                  <GroupComponent
                    id={key}
                    {...more}
                  >
                    {node ?? label}
                  </GroupComponent>
                </Context.Provider>
              );
            }
            return optionNodes;
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
