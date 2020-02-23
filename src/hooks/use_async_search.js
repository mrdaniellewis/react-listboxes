import { useCallback, useReducer, useRef } from 'react';

export const useAsyncSearch = (fn, initialOptions) => {
  const [{ options, busy }, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    { options: initialOptions || [], busy: false },
  );
  const lastSearchRef = useRef();

  const onSearch = useCallback(async (query) => {
    if (!query) {
      dispatch({ options: initialOptions || [] });
      return;
    }
    lastSearchRef.current = query;
    dispatch({ busy: true });
    const results = await fn(query);
    // Prevent out of sync returns clobbering the results
    if (lastSearchRef.current !== query) {
      return;
    }
    if (results === null) {
      dispatch({ busy: false });
    }
    dispatch({ options: results, busy: false });
  }, [fn, initialOptions]);

  return [options, onSearch, busy];
};
