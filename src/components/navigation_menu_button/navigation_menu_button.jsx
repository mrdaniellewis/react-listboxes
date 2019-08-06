import React from 'react';
import { component } from '../../validators/component.js';
import { MenuButton } from '../menu_button/index.jsx';

export function NavigationMenuButton(props) {
  return (
    <MenuButton
      {...props}
    />
  );
}

NavigationMenuButton.propTypes = {
  MenuComponent: component,
  MenuItemComponent: component,
};

NavigationMenuButton.defaultProps = {
  MenuComponent: 'div',
  MenuItemComponent: 'a',
};
