import React, { forwardRef } from 'react';
import { ComboBox } from './combo_box.jsx';
import { Option } from './combo_box_table/option.jsx';
import { GroupLabel } from './combo_box_table/group_label.jsx';
import { ListBox } from './combo_box_table/list_box.jsx';

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
