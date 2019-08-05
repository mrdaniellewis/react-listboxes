import React from 'react';
import { DropDown } from './drop_down/drop_down.jsx';
import { Separator } from './separator.jsx';
import { MenuItemLink } from './menu_item_link.jsx';
import { ListBoxMenu } from './list_box_menu.jsx';

export function NavigationMenu(props) {
  return (
    <DropDown
      GroupComponent={Separator}
      OptionComponent={MenuItemLink}
      ListBoxComponent={ListBoxMenu}
      expandOnHover
      setValue={() => {}}
      {...props}
    />
  );
}
