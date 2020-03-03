import React, { forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

export const ListBox = forwardRef(({ children, hidden, ...props }, ref) => {
  const context = useContext(Context);
  const { props: { columns } } = context;
  return (
    <div
      hidden={hidden}
    >
      <table
        ref={ref}
        {...props}
      >
        <colgroup>
          {columns.map(({ name, html }) => (
            <col key={name} {...html} />
          ))}
        </colgroup>
        <tbody role="presentation">
          {children}
        </tbody>
      </table>
    </div>
  );
});

ListBox.propTypes = {
  children: PropTypes.node.isRequired,
  hidden: PropTypes.bool.isRequired,
};
