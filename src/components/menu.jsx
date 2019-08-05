import React from 'react';
import { DropDown } from './drop_down/index.jsx';
import { Separator } from './separator.jsx';
import { MenuItem } from './menu_item.jsx';

export function Menu(props) {
  return (
    <DropDown
      GroupComponent={Separator}
      OptionComponent={MenuItem}
      setValue={() => {}}
      expandOnHover
      {...props}
    />
  );
}
