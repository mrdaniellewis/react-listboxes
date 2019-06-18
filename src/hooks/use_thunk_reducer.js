import { useReducer } from 'reinspect';
import { useRef, useCallback } from 'react';

export function useThunkReducer(reducer, props, initialState, name) {
  const [state, dispatch] = useReducer(reducer, props, initialState, name);
  const ref = useRef(state);
  ref.current = state;
  const thunkDispatch = useCallback(
    data => (typeof data === 'function' ? data(dispatch, () => ref.current) : dispatch(data)),
    [],
  );

  return [state, thunkDispatch];
}
