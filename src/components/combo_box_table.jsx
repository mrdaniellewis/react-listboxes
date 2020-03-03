import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box.jsx';
import { Option } from './listbox_table/option.jsx';
import { GroupLabel } from './listbox_table/group_label.jsx';
import { ListBox } from './listbox_table/list_box.jsx';

export const ComboBoxTable = forwardRef(({ columns: rawColumns, ...props }, ref) => {
  const columns = useMemo(() => (
    rawColumns.map((column) => {
      if (typeof column === 'string') {
        return {
          name: column,
        };
      }
      return column;
    })
  ), [rawColumns]);

  return (
    <ComboBox
      ref={ref}
      ListBoxComponent={ListBox}
      GroupLabelComponent={GroupLabel}
      OptionComponent={Option}
      columns={columns}
      {...props}
    />
  );
});

ComboBoxTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ])).isRequired,
};

ComboBoxTable.displayName = 'ComboBoxTable';
