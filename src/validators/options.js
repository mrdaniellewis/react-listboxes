import PropTypes from 'prop-types';
import { arrayMembers } from './array_members.js';

export const options = PropTypes.arrayOf(PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
  PropTypes.arrayOf(arrayMembers([
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]).isRequired,
    PropTypes.string.isRequired,
  ])),
  PropTypes.shape({
    disabled: PropTypes.bool,
    value: PropTypes.any,
    label: PropTypes.string.isRequired,
    group: PropTypes.string,
    node: PropTypes.node,
    id: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    key: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
  }),
]));
