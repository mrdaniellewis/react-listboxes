import { Fragment } from 'react';
import PropTypes from 'prop-types';

export const component = PropTypes.oneOfType([
  PropTypes.oneOf([Fragment]), // Fragment - which is a symbol
  PropTypes.string, // Native element
  PropTypes.func, // function, stateless or class component
  PropTypes.shape({
    render: PropTypes.func.isRequired, // React.forwardRef
  }),
]);
