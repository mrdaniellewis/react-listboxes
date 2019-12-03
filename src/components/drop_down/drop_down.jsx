import React, { useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import {
  clearSearch, onKeyDown, setFocusedIndex, onBlur,
  onToggleOpen, onFocus, onButtonKeyDown, onClick,
  onOptionsChanged, setListProps,
} from './actions.js';
import { Context } from '../../context.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { usePrevious } from '../../hooks/use_previous.js';
import { componentValidator } from '../../validators/component_validator.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';
import { classGenerator } from '../../helpers/class_generator.js';
import { joinTokens } from '../../helpers/join_tokens.js';

export function DropDown(rawProps) {
  const optionisedProps = useNormalisedOptions(rawProps, { mustHaveSelection: true });
  const {
    options, value: _, setValue, id, className,
    children, selectedIndex, managedFocus, layoutListBox,
    DropDownComponent, DropDownProps,
    ButtonComponent, ButtonProps,
    ListBoxComponent, ListBoxProps,
    OptionComponent, OptionProps,
    GroupComponent, GroupProps,
    ValueComponent, ValueProps,
    ...componentProps
  } = optionisedProps;
  const buttonRef = useRef();
  const listRef = useRef();
  const focusedRef = useRef();

  const [state, dispatch] = useReducer(
    reducer,
    { ...optionisedProps, buttonRef, listRef },
    initialState,
    id,
  );
  const { expanded, search, focusedIndex, listClassName, listStyle } = state;
  const onBlurHandler = useOnBlur(() => dispatch(onBlur()), listRef);

  const prevOptions = usePrevious(options);
  useLayoutEffect(() => {
    if (prevOptions && prevOptions !== options) {
      dispatch(onOptionsChanged(prevOptions));
    }
  }, [prevOptions, options]);

  useEffect(() => {
    if (!search || !expanded) {
      return undefined;
    }
    const found = options.findIndex((o) => o.label.toLowerCase().startsWith(search));
    if (found > -1) {
      dispatch(setFocusedIndex(found));
    }
    const timeout = setTimeout(() => dispatch(clearSearch()), 1000);

    return () => clearTimeout(timeout);
  }, [options, search, expanded, setValue]);

  useLayoutEffect(() => {
    if (expanded && options[focusedIndex] && managedFocus) {
      focusedRef.current.focus();
    } else if (expanded) {
      listRef.current.focus();
    }
  }, [expanded, managedFocus, options, focusedIndex]);

  useLayoutEffect(() => {
    if (layoutListBox && expanded) {
      const listProps = layoutListBox({
        listbox: listRef.current,
        button: buttonRef.current,
        option: focusedRef.current,
      });
      if (listProps) {
        dispatch(setListProps(listProps));
      }
    }
  }, [layoutListBox, expanded, focusedIndex, options]);

  const classes = classGenerator(className);

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, listRef, buttonRef, ...state }}>
      <DropDownComponent
        {...(DropDownComponent === Fragment ? undefined : { className })}
        {...DropDownProps}
        {...componentProps}
      >
        <ButtonComponent
          type="button"
          id={id}
          aria-controls={`${id}_listbox`}
          aria-expanded={expanded ? 'true' : null}
          aria-haspopup="listbox"
          ref={buttonRef}
          onClick={() => dispatch(onToggleOpen())}
          onKeyDown={(e) => dispatch(onButtonKeyDown(e))}
          className={classes('button')}
          {...ButtonProps}
        >
          {children ?? options[selectedIndex].label}
        </ButtonComponent>
        <ListBoxComponent
          ref={listRef}
          id={`${id}_listbox`}
          role="listbox"
          hidden={!expanded}
          tabIndex={-1}
          aria-activedescendant={options[focusedIndex]?.key || null}
          onFocus={(e) => dispatch(onFocus(e))}
          onBlur={onBlurHandler}
          onKeyDown={(e) => dispatch(onKeyDown(e))}
          className={joinTokens(classes('listbox'), listClassName)}
          {...ListBoxProps}
          style={listStyle}
        >
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, index, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ dispatch, ...optionisedProps, ...state, group }}
                >
                  <GroupComponent
                    id={key}
                    ref={index === focusedIndex ? focusedRef : null}
                    role="group"
                    aria-label={label}
                    tabIndex={-1}
                    aria-disabled="true"
                    className={classes('group', index === focusedIndex && '--focused')}
                    {...GroupProps}
                    {...html}
                  >
                    {label}
                  </GroupComponent>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { label, key, html, disabled, index, selected, group } = option;
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
                    ref={index === focusedIndex ? focusedRef : null}
                    className={classes('option', index === focusedIndex && '--focused', group && '--grouped')}
                    {...OptionProps}
                    {...html}
                    onClick={disabled ? null : (e) => dispatch(onClick(e, option))}
                  >
                    <ValueComponent
                      {...ValueProps}
                    >
                      {label}
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
  layoutListBox: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  setValue: PropTypes.func.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  managedFocus: PropTypes.bool,
  className: PropTypes.string,
  ListBoxComponent: componentValidator,
  ListBoxProps: PropTypes.object,
  ButtonComponent: componentValidator,
  ButtonProps: PropTypes.object,
  GroupComponent: componentValidator,
  GroupProps: PropTypes.object,
  OptionComponent: componentValidator,
  OptionProps: PropTypes.object,
  ValueComponent: componentValidator,
  ValueProps: PropTypes.object,
  DropDownComponent: componentValidator,
  DropDownProps: PropTypes.object,
};

DropDown.defaultProps = {
  blank: '',
  children: null,
  layoutListBox: null,
  value: null,
  className: 'dropdown',
  managedFocus: true,
  ListBoxComponent: 'ul',
  ListBoxProps: null,
  ButtonComponent: 'button',
  ButtonProps: null,
  GroupComponent: 'li',
  GroupProps: null,
  OptionComponent: 'li',
  OptionProps: null,
  ValueComponent: Fragment,
  ValueProps: null,
  DropDownComponent: 'div',
  DropDownProps: null,
};
