import React from 'react';
import PropTypes from 'prop-types';
import { StateInspector } from '../../reinspect.js';
import { MenuButton } from './menu_button.jsx';

function Inspector({ children, ...props }) {
  const { id } = props;
  return (
    <StateInspector name={id}>
      <MenuButton {...props}>
        {children}
      </MenuButton>
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

export { Inspector as MenuButton };
