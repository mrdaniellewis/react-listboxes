import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

export function GroupLabel({ children, ...props }) {
  const { props: { columns, classNames } } = useContext(Context);
  return (
    <tr
      {...props}
    >
      <td
        colSpan={columns.length}
        role="presentation"
        className={classNames?.tableGroupCell}
      >
        {children}
      </td>
    </tr>
  );
}

GroupLabel.propTypes = {
  children: PropTypes.node.isRequired,
};
