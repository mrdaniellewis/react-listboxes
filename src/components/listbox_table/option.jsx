import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';

export const Option = forwardRef((props, ref) => {
  const context = useContext(Context);
  const {
    props: {
      columns, ValueComponent, classNames,
      TableRowComponent, TableCellComponent, tableRowProps, tableCellProps,
    },
    selected,
    option,
    group,
  } = context;

  return (
    <TableRowComponent
      ref={ref}
      {...props}
      className={classNames?.[`tableRow${selected ? 'Selected' : ''}${group ? 'Grouped' : ''}`]}
      {...tableRowProps}
    >
      {columns.map((column, index) => (
        <Context.Provider key={column.name} value={{ ...context, column }}>
          <TableCellComponent
            role="presentation"
            title={column.label || null}
            className={classNames?.tableCell}
            {...tableCellProps}
          >
            {group && index === 0 && (
              <div className={classNames?.visuallyHidden}>
                {group.label}
              </div>
            )}
            {column.label && (
              <div className={classNames?.visuallyHidden}>
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
