import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';

export const Option = forwardRef((props, ref) => {
  const context = useContext(Context);
  const {
    props: {
      columns, ValueComponent, classNames,
      TableRowComponent, TableCellComponent, tableRowProps, tableCellProps,
      VisuallyHiddenComponent, visuallyHiddenProps,
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
              <VisuallyHiddenComponent
                {...visuallyHiddenProps}
              >
                {group.label}
              </VisuallyHiddenComponent>
            )}
            {column.label && (
              <VisuallyHiddenComponent
                {...visuallyHiddenProps}
              >
                {column.label}
              </VisuallyHiddenComponent>
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
