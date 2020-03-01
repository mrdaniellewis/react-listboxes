import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';

export const Option = forwardRef((props, ref) => {
  const context = useContext(Context);
  const { props: { columns, ValueComponent }, option } = context;
  return (
    <tr
      ref={ref}
      {...props}
    >
      {columns.map((column) => (
        <Context.Provider value={{ ...context, column }}>
          <td
            role="presentation"
          >
            <ValueComponent>
              {option[column.name]}
            </ValueComponent>
          </td>
        </Context.Provider>
      ))}
    </tr>
  );
});
