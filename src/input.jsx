import React, { useContext } from 'react';
import classNames from 'classnames';
import { Context } from './context.js';
import { inputFocus, inputKeyDown } from './actions.js';

export function Input() {
  const {
    activeId,
    'aria-describedby': ariaDescribedBy,
    dispatch,
    id,
    Input: RenderInput,
    inputValue,
    placeholder,
    required,
    onSearch,
  } = useContext(Context);

  return (
    <RenderInput
      aria-activedescendant={activeId}
      aria-autocomplete="list"
      aria-atomic="true"
      aria-controls={`${id}_listbox`}
      aria-describedby={classNames(ariaDescribedBy, `${id}_not-found ${id}_screenreader-hints`)}
      autoComplete="off"
      id={id}
      value={inputValue}
      type="search"
      placeholder={placeholder}
      required={required}
      onChange={({ target: { value } }) => onSearch(value)}
      onKeyDown={event => dispatch(inputKeyDown({ event }))}
      onFocus={() => dispatch(inputFocus())}
    />
  );
}
