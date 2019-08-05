/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
  const { StateInspector, useReducer } = require('reinspect');
  exports.StateInspector = StateInspector;
  exports.useReducer = useReducer;
} else {
  const { Fragment, useReducer } = require('react');
  exports.StateInspector = Fragment;
  exports.useReducer = useReducer;
}
