import React, { useRef, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import PropTypes from 'prop-types';

export const PopupButton = forwardRef(({
  children, expanded, hasPopup, setExpanded, targetRef, ...props
}, ref) => {
  const buttonRef = useRef(ref);

  useLayoutEffect(() => {
    if (expanded) {
      if (document.activeElement === buttonRef.current) {
        targetRef.current.focus();
      }
    }
  }, [expanded, targetRef]);

  useImperativeHandle(ref, () => ({
    focus: () => {
      buttonRef.current.focus();
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
  targetRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
};

PopupButton.defaultProps = {
  expanded: false,
  hasPopup: true,
};
