import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../../context.js';

export function GroupLabel({ children, ...props }) {
  const { props: { columns } } = useContext(Context);
  return (
    <tr
      {...props}
      role="presentation"
    >
      <td
        colSpan={columns.length}
        role="presentation"
      >
        {children}
      </td>
    </tr>
  );
}

GroupLabel.propTypes = {
  children: PropTypes.node.isRequired,
};
