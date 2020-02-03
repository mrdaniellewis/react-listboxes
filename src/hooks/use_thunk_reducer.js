import { useRef, useCallback, useReducer } from 'react';

export function useThunkReducer(reducer, props, initialState) {
  // Holds the latest props
  const propsRef = useRef(props);

  // Special reducer with the signature (state, props, action)
  const propsReducer = useCallback((state, action) => (
    reducer(state, propsRef.current, action)
  ), [reducer]);

  const [state, dispatch] = useReducer(propsReducer, props, initialState);

  // Holds the latest state
  const stateRef = useRef(state);

  stateRef.current = state;
  propsRef.current = props;

  // Special dispatch that will call a returned method with (dispatch, getState, getProps)
  const thunkDispatch = useCallback((data) => (
    typeof data === 'function'
      ? data(thunkDispatch, () => stateRef.current, () => propsRef.current)
      : dispatch(data)
  ), []);

  return [state, thunkDispatch];
}
