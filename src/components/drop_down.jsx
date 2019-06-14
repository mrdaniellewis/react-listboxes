import React, { useState, useRef, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { ListBox } from './list_box.jsx';

export function DropDown({ id, options, value, ...props }) {
  const [expanded, setExpanded] = useState(false);
  const buttonRef = useRef();
  const listRef = useRef();

  function onClick() {
    setExpanded(true);
  }

  useLayoutEffect(() => {
    if (expanded) {
      listRef.current.focus();
    }
  }, [expanded]);

  function onBlur() {
    setTimeout(() => {
      if (!listRef.current.contains(document.activeElement)) {
        setExpanded(false);
        buttonRef.current.focus();
      }
    }, 0);
  }

  return (
    <>
      <button
        type="button"
        ref={buttonRef}
        aria-haspopup="listbox"
        aria-labelledby=""
        aria-expanded={expanded ? 'true' : null}
        onClick={onClick}
      >
        button
      </button>
      <ListBox
        id={id}
        options={options}
        hidden={!expanded}
        ref={listRef}
        onKeyDown={() => {}}
        onChange={() => {}}
        onBlur={onBlur}
      />
    </>
  );
}
