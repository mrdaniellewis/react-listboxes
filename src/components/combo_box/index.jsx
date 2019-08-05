import React from 'react';
import PropTypes from 'prop-types';
import { StateInspector } from '../../reinspect.js';
import { ComboBox } from './combo_box.jsx';

function Inspector({ children, ...props }) {
  const { id } = props;
  return (
    <StateInspector name={id}>
      <ComboBox {...props}>
        {children}
      </ComboBox>
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

export { Inspector as ComboBox };
