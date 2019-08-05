import { useRef, useCallback } from 'react';
import { useReducer } from '../reinspect.js';

export function useThunkReducer(reducer, props, initialState, name) {
  const [state, dispatch] = useReducer(reducer, props, initialState, name);
  const stateRef = useRef(state);
  const propsRef = useRef(props);
  stateRef.current = state;
  propsRef.current = props;
  const thunkDispatch = useCallback(
    data => (typeof data === 'function' ? data(thunkDispatch, () => stateRef.current, () => propsRef.current) : dispatch(data)),
    [],
  );

  return [state, thunkDispatch];
}
