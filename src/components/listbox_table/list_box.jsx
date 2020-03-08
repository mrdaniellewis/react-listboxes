import React, { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

export const ListBox = forwardRef(({ children, hidden, ...props }, ref) => {
  const context = useContext(Context);
  const { props: {
    columns, classNames, CustomListBoxComponent, customListBoxProps, TableComponent, tableProps,
  } } = context;
  return (
    <CustomListBoxComponent
      ref={ref}
      hidden={hidden}
      className={classNames?.listbox}
      tabIndex={-1}
      {...customListBoxProps}
    >
      <TableComponent
        {...props}
        className={classNames?.listboxTable}
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
  style: PropTypes.object,
};

ListBox.defaultProps = {
  style: null,
};
