import React from 'react';
import PropTypes from 'prop-types';
import { StateInspector } from '../../reinspect.js';
import { Menu } from './menu.jsx';

function Inspector({ children, ...props }) {
  const { id } = props;
  return (
    <StateInspector name={id}>
      <Menu {...props}>
        {children}
      </Menu>
    </StateInspector>
  );
}

Inspector.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
};

Inspector.defaultProps = {
  children: null,
};

export { Inspector as Menu };
