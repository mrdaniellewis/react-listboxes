import React, { forwardRef } from 'react';

export const Nav = forwardRef((props, ref) => (
  <nav
    {...props}
    ref={ref}
    role={null}
  />
));

Nav.displayName = 'Nav';
