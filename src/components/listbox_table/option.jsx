import React, { forwardRef, useContext } from 'react';
import { Context } from '../../context.js';
import { visuallyHiddenClassName } from '../../constants/visually_hidden_class_name.js';

const defaultClassNames = {
  visuallyHidden: visuallyHiddenClassName,
};

export const Option = forwardRef((props, ref) => {
  const context = useContext(Context);
  const { props: { columns, ValueComponent, classNames }, option, group } = context;
  const classes = { ...defaultClassNames, classNames };
  return (
    <tr
      ref={ref}
      {...props}
    >
      {columns.map((column, index) => (
        <Context.Provider key={column.name} value={{ ...context, column }}>
          <td
            role="presentation"
            title={column.label || null}
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
          </td>
        </Context.Provider>
      ))}
    </tr>
  );
});
