import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';

export const ListBox = forwardRef(({ children, ...props }, ref) => {
  const context = useContext(Context);
  const { props: { columns } } = context;
  return (
    <div
      ref={ref}
      {...props}
    >
      <table
        {...props}
      >
        <colgroup>
          {columns.map((column) => (
            <col />
          ))}
        </colgroup>
        {children}
      </table>
    </div>
  );
});
