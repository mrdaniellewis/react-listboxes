import { useRef, useCallback, useReducer } from 'react';

export function useThunkReducer(reducer, props, initialState, debug) {
  const [state, dispatch] = useReducer(reducer, props, initialState);
  const stateRef = useRef(state);
  const propsRef = useRef(props);
  stateRef.current = state;
  propsRef.current = props;
  const thunkDispatch = useCallback(
    (data) => {
      if (debug) {
        debug(data);
      }
      return typeof data === 'function'
        ? data(thunkDispatch, () => stateRef.current, () => propsRef.current)
        : dispatch(data);
    },
    [debug],
  );
  return [state, thunkDispatch];
}
