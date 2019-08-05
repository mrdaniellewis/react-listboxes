import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

export const MenuItemLink = forwardRef(({ children, ...props }, ref) => (
  <li
    role="none"
  >
    <a
      {...props}
      ref={ref}
      role="menuitem"
      onClick={null}
    >
      {children}
    </a>
  </li>
));

MenuItemLink.propTypes = {
  children: PropTypes.node.isRequired,
};

MenuItemLink.displayName = 'MenuItemLink';
