import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

export const PopupButton = forwardRef(({
  children, expanded, hasPopup, setExpanded, ...props
}, ref) => {
  const buttonRef = useRef();

  useImperativeHandle(ref, () => ({
    focus() {
      buttonRef.current.focus();
    },
    contains(el) {
      return buttonRef.current.contains(el);
    },
  }));

  return (
    <button
      type="button"
      ref={buttonRef}
      aria-haspopup={hasPopup}
      aria-expanded={expanded ? 'true' : null}
      onClick={() => setExpanded(!expanded)}
      {...props}
    >
      {children}
    </button>
  );
});

PopupButton.propTypes = {
  children: PropTypes.node.isRequired,
  expanded: PropTypes.bool,
  hasPopup: PropTypes.oneOf([true, 'menu', 'listbox', 'tree', 'grid', 'dialog']),
  setExpanded: PropTypes.func.isRequired,
};

PopupButton.defaultProps = {
  expanded: false,
  hasPopup: true,
};
