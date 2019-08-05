import React from 'react';
import { DropDown } from './drop_down/drop_down.jsx';
import { Separator } from './separator.jsx';
import { MenuItemLink } from './menu_item_link.jsx';

export function NavigationMenu(props) {
  return (
    <DropDown
      GroupComponent={Separator}
      OptionComponent={MenuItemLink}
      expandOnHover
      setValue={() => {}}
      {...props}
    />
  );
}
