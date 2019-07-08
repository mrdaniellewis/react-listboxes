import React from 'react';
import PropTypes from 'prop-types';
import { StateInspector } from 'reinspect';
import { DropDown } from './drop_down.jsx';

function Inspector({ children, ...props }) {
  const { id } = props;
  return (
    <StateInspector name={id}>
      <DropDown {...props}>
        {children}
      </DropDown>
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

export { Inspector as DropDown };
