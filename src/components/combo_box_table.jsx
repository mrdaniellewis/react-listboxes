import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from './combo_box.jsx';
import { Option } from './listbox_table/option.jsx';
import { GroupLabel } from './listbox_table/group_label.jsx';
import { ListBox } from './listbox_table/list_box.jsx';
import { componentValidator } from '../validators/component_validator.js';

export const ComboBoxTable = forwardRef((
  { columns: rawColumns, ListBoxComponent, listBoxProps, ...props },
  ref,
) => {
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
      CustomListBoxComponent={ListBoxComponent}
      customListBoxProps={listBoxProps}
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
  ListBoxComponent: componentValidator,
  listBoxProps: PropTypes.object,
  TableComponent: componentValidator,
  tableProps: PropTypes.object,
  TableRowComponent: componentValidator,
  tableRowProps: PropTypes.object,
  TableCellComponent: componentValidator,
  tableCellProps: PropTypes.object,
  classNames: PropTypes.object,
};

ComboBoxTable.defaultProps = {
  ListBoxComponent: 'div',
  listBoxProps: null,
  TableComponent: 'table',
  tableProps: null,
  TableRowComponent: 'tr',
  tableRowProps: null,
  TableCellComponent: 'td',
  tableCellProps: null,

  classNames: {
    ...ComboBox.defaultProps.classNames,
    listboxTable: 'combobox__listbox-table',
    tableRow: 'combobox__table-row',
    tableRowSelected: 'combobox__table-row',
    tableRowGrouped: 'combobox__table-row combobox__table-row_grouped',
    tableRowSelectedGrouped: 'combobox__table-row combobox__table-row_grouped',
    tableCell: 'combobox__table-cell',
    tableGroupCell: null,
  },
};

ComboBoxTable.displayName = 'ComboBoxTable';
