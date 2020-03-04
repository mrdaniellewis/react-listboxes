import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';
import { visuallyHiddenClassName } from '../../constants/visually_hidden_class_name.js';

const defaultClassNames = {
  visuallyHidden: visuallyHiddenClassName,
  tableRow: 'combobox__table__row',
  tableCell: 'combobox__table__cell',
};

export const Option = forwardRef((props, ref) => {
  const context = useContext(Context);
  const {
    props: {
      columns, ValueComponent, classNames,
      TableRowComponent, TableCellComponent, tableRowProps, tableCellProps,
    },
    option,
    group,
  } = context;

  const classes = { ...defaultClassNames, classNames };
  return (
    <TableRowComponent
      ref={ref}
      {...props}
      className={classes.tableRow}
      {...tableRowProps}
    >
      {columns.map((column, index) => (
        <Context.Provider key={column.name} value={{ ...context, column }}>
          <TableCellComponent
            role="presentation"
            title={column.label || null}
            className={classes.tableCell}
            {...tableCellProps}
          >
            {group && index === 0 && (
              <div className={classes.visuallyHidden}>
                {group.label}
              </div>
            )}
            {column.label && (
              <div className={classes.visuallyHidden}>
                {column.label}
              </div>
            )}
            <ValueComponent>
              {option.value[column.name]}
            </ValueComponent>
          </TableCellComponent>
        </Context.Provider>
      ))}
    </TableRowComponent>
  );
});
