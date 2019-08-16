import React, { useRef, useEffect, useLayoutEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { useThunkReducer as useReducer } from '../../hooks/use_thunk_reducer.js';
import { reducer } from './reducer.js';
import { initialState } from './initial_state.js';
import { onKeyDown, onChange, onFocus, onSelectValue, onBlur, setExpanded, setSelected } from './actions.js';
import { Context } from '../../context.js';
import { options as validateOptions } from '../../validators/options.js';
import { useNormalisedOptions } from '../../hooks/use_normalised_options.js';
import { useSelectedIndex } from '../../hooks/use_selected_index.js';
import { useOnBlur } from '../../hooks/use_on_blur.js';
import { joinTokens } from '../../helpers/join_tokens.js';
import { componentCustomiser } from '../../validators/component_customiser.js';
import { renderGroupedOptions } from '../../helpers/render_grouped_options.js';
import { dismemberComponent } from '../../helpers/dismember_component.js';

export function ComboBox({
  ComboBoxComponent, OptionComponent, GroupComponent, ListBoxComponent, InputComponent,
  SpinnerComponent, NotFoundComponent, ClearButtonComponent,
  OpenButtonComponent, ValueComponent, ...rawProps
}) {
  const comboRef = useRef();
  const inputRef = useRef();
  const selectedRef = useRef();

  const optionisedProps = useNormalisedOptions({ ...rawProps });
  const {
    notFoundMessage, options, value, id, busy, managedFocus, labelId,
    className, setValue: _1, onSearch: _2, valueIndex: _3, ...componentProps
  } = optionisedProps;
  const [state, dispatch] = useReducer(reducer, { ...optionisedProps, inputRef }, initialState, id);
  const { expanded, search, listBoxFocused, selectedValue, focused } = state;
  const selectedIndex = useSelectedIndex({ options, selectedValue });

  const activeId = (listBoxFocused && selectedValue?.id) || null;
  const showListBox = expanded && options.length;
  const showNotFound = expanded && !options.length && search?.trim();
  const inputLabel = search !== null ? search : (value?.label) || '';
  const showBusy = busy && search !== (value?.label);

  const blur = useOnBlur(() => dispatch(onBlur()), comboRef);

  useEffect(() => {
    dispatch(setSelected(value));
  }, [value]);

  useLayoutEffect(() => {
    if (expanded && options[selectedIndex] && managedFocus) {
      selectedRef.current.focus();
    } else if (expanded) {
      inputRef.current.focus();
    }
  }, [expanded, managedFocus, selectedIndex, options]);

  const customComboBoxComponent = dismemberComponent(ComboBoxComponent, 'div');
  const customInputComponent = dismemberComponent(InputComponent, 'input');
  const customListBoxComponent = dismemberComponent(ListBoxComponent, 'ul');
  const customGroupComponent = dismemberComponent(GroupComponent, 'li');
  const customOptionComponent = dismemberComponent(OptionComponent, 'li');
  const customValueComponent = dismemberComponent(ValueComponent);
  const customSpinnerComponent = dismemberComponent(SpinnerComponent, 'span');
  const customClearButtonComponent = dismemberComponent(ClearButtonComponent, 'span');
  const customOpenButtonComponent = dismemberComponent(OpenButtonComponent, 'span');
  const customNotFoundComponent = dismemberComponent(NotFoundComponent, 'div');

  return (
    <Context.Provider value={{ dispatch, ...optionisedProps, ...state }}>
      <customComboBoxComponent.type
        aria-busy={showBusy ? 'true' : 'false'}
        className={className}
        onBlur={blur}
        ref={comboRef}
        {...customComboBoxComponent.props}
        {...componentProps}
      >
        <customSpinnerComponent.type
          className="spinner"
          hidden={!showBusy}
          {...customSpinnerComponent.props}
        />
        <customInputComponent.type
          id={id}
          type="text"
          role="combobox"
          aria-autocomplete="both"
          aria-haspopup="true"
          aria-owns={`${id}_list_box`}
          aria-expanded={showListBox ? 'true' : 'false'}
          aria-activedescendant={activeId}
          data-focused={focused ? 'true' : null}
          value={inputLabel}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onChange={e => dispatch(onChange(e))}
          onFocus={e => dispatch(onFocus(e))}
          aria-describedby={joinTokens(showNotFound && `${id}_not_found`, `${id}_info`)}
          autoComplete="off"
          ref={inputRef}
          {...customInputComponent.props}
        />
        <customClearButtonComponent.type
          onMouseDown={e => e.preventDefault()}
          onClick={(e) => {
            if (e.button > 0) {
              return;
            }
            inputRef.current.focus();
            dispatch(onSelectValue(null));
          }}
          hidden={!value}
          aria-label="Clear"
          id={`${id}_clear_button`}
          aria-labelledby={joinTokens(`${id}_clear_button`, labelId, id)}
          {...customClearButtonComponent.props}
        >
          ×
        </customClearButtonComponent.type>
        <customOpenButtonComponent.type
          onMouseDown={e => e.preventDefault()}
          onClick={(e) => {
            if (e.button > 0) {
              return;
            }
            inputRef.current.focus();
            dispatch(setExpanded(true));
          }}
          aria-hidden="true"
          {...customOpenButtonComponent.props}
        >
          ▼
        </customOpenButtonComponent.type>
        <customListBoxComponent.type
          id={`${id}_list_box`}
          role="listbox"
          tabIndex={-1}
          hidden={!showListBox}
          aria-activedescendant={options[selectedIndex]?.id ?? null}
          onKeyDown={e => dispatch(onKeyDown(e))}
          onMouseDown={e => e.preventDefault()}
          {...customListBoxComponent.props}
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
                  <customGroupComponent.type
                    id={key}
                    aria-hidden="true" // Hidden otherwise VoiceOver counts the wrong number of options
                    {...customGroupComponent.props}
                    {...html}
                  >
                    {node ?? label}
                  </customGroupComponent.type>
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
                  <customOptionComponent.type
                    id={key}
                    role="option"
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    aria-labelledby={group ? `${group.key} ${key}` : null}
                    data-focused={index === selectedIndex ? 'true' : null}
                    ref={index === selectedIndex ? selectedRef : null}
                    {...customOptionComponent.props}
                    {...html}
                    onClick={disabled ? null : () => dispatch(onSelectValue(option))}
                  >
                    <customValueComponent.type
                      {...customValueComponent.props}
                    >
                      {node ?? label}
                    </customValueComponent.type>
                  </customOptionComponent.type>
                </Context.Provider>
              );
            },
          })}
        </customListBoxComponent.type>
        <customNotFoundComponent.type
          id={`${id}_not_found`}
          hidden={!showNotFound}
          role="alert"
          aria-live="polite"
          {...customNotFoundComponent.props}
        >
          {showNotFound ? notFoundMessage : null}
        </customNotFoundComponent.type>
      </customComboBoxComponent.type>
    </Context.Provider>
  );
}

ComboBox.propTypes = {
  busy: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string.isRequired,
  managedFocus: PropTypes.bool,
  notFoundMessage: PropTypes.node,
  onSearch: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  options: validateOptions.isRequired,
  setValue: PropTypes.func.isRequired, // eslint-disable-line react/no-unused-prop-types
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types

  ClearButtonComponent: componentCustomiser,
  ComboBoxComponent: componentCustomiser,
  GroupComponent: componentCustomiser,
  InputComponent: componentCustomiser,
  ListBoxComponent: componentCustomiser,
  NotFoundComponent: componentCustomiser,
  OpenButtonComponent: componentCustomiser,
  OptionComponent: componentCustomiser,
  SpinnerComponent: componentCustomiser,
  ValueComponent: componentCustomiser,
};

ComboBox.defaultProps = {
  busy: null,
  className: 'combobox',
  managedFocus: true,
  notFoundMessage: 'No matches found',
  value: null,

  ClearButtonComponent: 'span',
  ComboBoxComponent: 'div',
  GroupComponent: 'li',
  InputComponent: 'input',
  ListBoxComponent: 'ul',
  NotFoundComponent: 'div',
  OpenButtonComponent: 'span',
  OptionComponent: 'li',
  SpinnerComponent: 'span',
  ValueComponent: Fragment,
};
