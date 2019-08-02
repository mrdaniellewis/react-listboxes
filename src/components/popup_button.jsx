import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';
import { component } from '../validators/component.js';

export const PopupButton = forwardRef(({
  children, expanded, hasPopup, setExpanded, ButtonComponent, ...props
}, ref) => {
  const buttonRef = useRef();
  const [skipExpand, setSkipExpand] = useState(false);

  useImperativeHandle(ref, () => ({
    focus() {
      buttonRef.current.focus();
    },
    contains(el) {
      return buttonRef.current.contains(el);
    },
  }));

  function clickHandler() {
    if (!expanded && !skipExpand) {
      setExpanded(true);
    } else if (skipExpand) {
      setSkipExpand(false);
    }
  }

  return (
    <ButtonComponent
      type="button"
      ref={buttonRef}
      aria-haspopup={hasPopup}
      aria-expanded={expanded ? 'true' : null}
      onClick={clickHandler}
      onMouseDown={() => expanded && setSkipExpand(true)}
      {...props}
    >
      {children}
    </ButtonComponent>
  );
});

PopupButton.propTypes = {
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  hasPopup: PropTypes.oneOf([true, 'menu', 'listbox', 'tree', 'grid', 'dialog']),
  setExpanded: PropTypes.func.isRequired,
  ButtonComponent: component,
};

PopupButton.defaultProps = {
  expanded: false,
  hasPopup: true,
  ButtonComponent: 'button',
};

PopupButton.displayName = 'PopupButton';
