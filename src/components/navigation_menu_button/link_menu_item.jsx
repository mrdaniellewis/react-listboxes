import React, { forwardRef } from 'react';

export const ListMenu = forwardRef((props, ref) => (
  <ul
    {...props}
    ref={ref}
    role={null}
  />
));

ListMenu.displayName = 'ListMenu';
