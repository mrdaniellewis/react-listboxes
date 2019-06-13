import React from 'react';
import PropTypes from 'prop-types';
import { useReducer } from 'reinspect';
import { reducer } from './reducer.js';
import { component } from './validators/component.js';
import { Wrapper } from './wrapper.jsx';
import { GroupName } from './group-name.jsx';
import { Value } from './value.js';
import { initialState } from './initial-state.js';
import { propChange } from './actions.js';
import { useProps } from './hooks/use-props.js';

import { Context } from './context.js';

const thunkDispatch = ({ dispatch, state, props }) => input => (
  input instanceof Function ? input(dispatch, state, props) : dispatch(input)
);

export function Core({ children, ...props }) {
  const { id } = props;
  const [state, dispatch] = useReducer(reducer, props, initialState, id);

  useProps(changedProps => dispatch(propChange(changedProps)), props, ['options', 'busy', 'pluckDisabled', 'value']);

  const contextValue = {
    ...props,
    ...state,
    dispatch: thunkDispatch({ state, dispatch, props }),
  };
  return (
    <Context.Provider value={contextValue}>
      <Wrapper>
        {children}
      </Wrapper>
    </Context.Provider>
  );
}

Core.propTypes = {
  'aria-describedby': PropTypes.string,
  busy: PropTypes.bool,
  options: PropTypes.arrayOf(PropTypes.object),
  children: PropTypes.func,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  notFoundMessage: PropTypes.node,
  Input: component,
  ListBox: component,
  NotFound: component,
  Wrapper: component,
  Group: component,
  GroupName: component,
  Option: component,
  Value: component,
  pluckIdentity: PropTypes.func,
  pluckDisabled: PropTypes.func,
  pluckGroup: PropTypes.func,
  pluckLabel: PropTypes.func,
};

Core.defaultProps = {
  'aria-describedby': null,
  busy: false,
  placeholder: null,
  options: [],
  required: false,
  children: ({ input, listbox }) => ( // eslint-disable-line react/prop-types
    <>
      {input}
      {listbox}
    </>
  ),
  notFoundMessage: 'No matches found',
  Input: 'input',
  ListBox: 'div',
  NotFound: 'div',
  Wrapper: 'div',
  Group: 'div',
  GroupName,
  Option: 'div',
  Value,
  pluckIdentity: option => (option == null ? null : (option.id || option.value)),
  pluckDisabled: option => (option == null ? false : option.disabled),
  pluckGroup: option => option.group,
  pluckLabel: option => (option == null ? '' : option.label),
};
