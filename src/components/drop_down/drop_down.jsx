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
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { makePrefixSearch } from '../../helpers/make_prefix_search.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';

export function DropDown({
  ButtonComponent, ListBoxComponent, OptionComponent,
  GroupComponent, ValueComponent, DropDownComponent, ...rawProps
}) {
  const optionisedProps = useNormalisedOptions(rawProps);
  const {
    options, value, setValue, blank, id,
    children, managedFocus, labelId, ...componentProps
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
    if (expanded && options[selectedIndex] && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, options, selectedIndex]);

  console.log(options);

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
          aria-controls={`${id}_list_box`}
          aria-labelledby={labelId ? `${labelId} ${id}` : null}
          ref={buttonRef}
          onClick={() => dispatch(onToggleOpen())}
          onKeyDown={e => dispatch(onButtonKeyDown(e))}
        >
          {children || (value && value.label) || blank}
        </ButtonComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_list_box`}
          role="listbox"
          tabIndex={-1}
          hidden={!expanded}
          aria-activedescendant={options[selectedIndex]?.id || null}
          onFocus={e => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={e => dispatch(onKeyDown(e))}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, node, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, group }}
                >
                  <GroupComponent
                    id={key}
                    aria-hidden="true" // Hidden otherwise VoiceOver counts the wrong number of options
                    {...html}
                  >
                    {node ?? label}
                  </GroupComponent>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, node, html, disabled, index, selected, group } = option;
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
                    aria-labelledby={group ? `${group.key} ${key}` : null}
                    data-focused={index === selectedIndex ? 'true' : null}
                    ref={index === selectedIndex ? selectedRef : null}
                    {...html}
                    onClick={disabled ? null : e => onClick(e, option)}
                  >
                    <ValueComponent>
                      {node ?? label}
                    </ValueComponent>
                  </OptionComponent>
                </Context.Provider>
              );
            },
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
  labelId: PropTypes.string,
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
  labelId: null,
  managedFocus: true,
  ListBoxComponent: 'ul',
  ButtonComponent: 'button',
  GroupComponent: 'li',
  OptionComponent: 'li',
  ValueComponent: Fragment,
  DropDownComponent: Fragment,
};
