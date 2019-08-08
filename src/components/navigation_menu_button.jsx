import React from 'react';
import { componentCustomiser } from '../validators/component_customiser.js';
import { MenuButton } from './menu_button/index.jsx';

export function NavigationMenuButton(props) {
  return (
    <MenuButton
      {...props}
    />
  );
}

NavigationMenuButton.propTypes = {
  MenuComponent: componentCustomiser,
  MenuItemComponent: componentCustomiser,
};

NavigationMenuButton.defaultProps = {
  MenuComponent: <nav role={null} />,
  // eslint-disable-next-line jsx-a11y/anchor-is-valid, jsx-a11y/anchor-has-content
  MenuItemComponent: <a role={null} />,
};
