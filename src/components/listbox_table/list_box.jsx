import React, { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

const defaultClassNames = {
  listbox: 'combobox__listbox',
  listboxTable: 'combobox__listbox-table',
};

export const ListBox = forwardRef(({ children, hidden, ...props }, ref) => {
  const context = useContext(Context);
  const { props: { columns, classNames, CustomListBoxComponent, customListboxProps, TableComponent, tableProps } } = context;
  const classes = { ...defaultClassNames, classNames };
  return (
    <CustomListBoxComponent
      hidden={hidden}
      className={classes.listbox}
      {...customListboxProps}
    >
      <TableComponent
        ref={ref}
        {...props}
        className={classes.listboxTable}
        {...tableProps}
      >
        <colgroup>
          {columns.map(({ name, html }) => (
            <col key={name} {...html} />
          ))}
        </colgroup>
        <tbody role="presentation">
          {children}
        </tbody>
      </TableComponent>
    </CustomListBoxComponent>
  );
});

ListBox.propTypes = {
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool.isRequired,
};
