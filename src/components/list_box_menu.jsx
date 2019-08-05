import React, { forwardRef } from 'react';

export const ListBoxMenu = forwardRef((props, ref) => (
  <ul
    {...props}
    ref={ref}
    role="menu"
  />
));

ListBoxMenu.displayName = 'ListBoxMenu';
