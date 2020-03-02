import React, { forwardRef } from 'react';
import { ComboBox } from './combo_box.jsx';
import { Option } from './listbox_table/option.jsx';
import { GroupLabel } from './listbox_table/group_label.jsx';
import { ListBox } from './listbox_table/list_box.jsx';

export const ComboBoxTable = forwardRef(({ columns, ...props }, ref) => {
  return (
    <ComboBox
      ref={ref}
      ListBoxComponent={ListBox}
      GroupLabelComponent={GroupLabel}
      OptionComponent={Option}
      {...props}
    />
  );
});

ComboBoxTable.propTypes = {
  columns: PropTypes.objectOf(PropTypes.string).isRequired,
};

ComboBoxTable.displayName = 'ComboBoxTable';
