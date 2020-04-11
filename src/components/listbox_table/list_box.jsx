import React, { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

export const ListBox = forwardRef(({ children, hidden, id, 'aria-activedescendant': ariaActiveDescendant }, ref) => {
  const context = useContext(Context);
  const { props: {
    columns, classNames,
    listBoxProps,
    TableComponent, tableProps,
  } } = context;
  return (
    <div
      ref={ref}
      hidden={hidden}
      className={classNames?.listbox}
      tabIndex={-1}
      {...listBoxProps}
    >
      <TableComponent
        id={id}
        role="listbox"
        aria-activedescendant={ariaActiveDescendant}
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
    </div>
  );
});

ListBox.propTypes = {
  id: PropTypes.string.isRequired,
  'aria-activedescendant': PropTypes.string,
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool.isRequired,
  style: PropTypes.object,
};

ListBox.defaultProps = {
  'aria-activedescendant': null,
  style: null,
};
