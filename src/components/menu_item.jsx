import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

export const MenuItem = forwardRef(({ children, ...props }, ref) => (
  <li
    {...props}
    ref={ref}
    role="menuitem"
  >
    {children}
  </li>
));

MenuItem.propTypes = {
  children: PropTypes.node.isRequired,
};

MenuItem.displayName = 'MenuItem';
