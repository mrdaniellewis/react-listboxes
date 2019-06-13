import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Context } from './context.js';
import { Input } from './input.jsx';
import { ListBox } from './list-box.jsx';
import { NotFound } from './not-found.jsx';
import { useFocusOut } from './hooks/use-focus-out.js';
import { componentBlur } from './actions.js';

export function Wrapper({ children }) {
  const {
    'aria-describedby': ariaDescribedBy,
    activeId,
    dispatch,
    id,
    searchTerm,
    showListBox,
    busy,
    Wrapper: RenderWrapper,
    placeholder,
    required,
  } = useContext(Context);

  const onBlur = useCallback(() => dispatch(componentBlur()), [dispatch]);
  const ref = useFocusOut(onBlur);

  return (
    <RenderWrapper
      aria-expanded={showListBox ? 'true' : 'false'}
      aria-owns={classNames(id, showListBox && `${id}_listbox`)}
      aria-haspopup="listbox"
      aria-busy={busy ? 'true' : 'false'}
      aria-labelledby={`${id}_label`}
      role="combobox"
      ref={ref}
    >
      {children({
        input: (
          <Input
            aria-activedescendant={activeId}
            aria-autocomplete="list"
            aria-atomic="true"
            aria-controls={`${id}_listbox`}
            aria-describedby={classNames(ariaDescribedBy, `${id}_not-found`)}
            autoComplete="off"
            id={id}
            value={searchTerm}
            type="search"
            placeholder={placeholder}
            required={required}
          />
        ),
        listbox: (
          <>
            <NotFound />
            <ListBox />
          </>
        ),
      })}
    </RenderWrapper>
  );
}

Wrapper.propTypes = {
  children: PropTypes.func.isRequired,
};
