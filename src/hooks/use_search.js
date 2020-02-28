import { useCallback, useReducer, useRef, useEffect } from 'react';

export const useSearch = (fn, { initialOptions, debounce }) => {
  const [{ options, busy }, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    { options: initialOptions || [], busy: false },
  );

  const lastSearchRef = useRef();
  const timeoutRef = useRef();
  const unmountedRef = useRef(false);

  const search = useCallback(async (query) => {
    const results = await fn(query);
    // Prevent out of sync returns clobbering the results
    if (lastSearchRef.current !== query || unmountedRef.current) {
      return;
    }
    if (results === null) {
      dispatch({ busy: false });
    }
    dispatch({ options: results, busy: false });
  }, [fn]);

  const onSearch = useCallback((query) => {
    if (!query) {
      dispatch({ options: initialOptions || [] });
      return;
    }
    lastSearchRef.current = query;
    dispatch({ busy: true });

    if (debounce) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        search(query);
      }, debounce);
    } else {
      search(query);
    }
  }, [initialOptions, search, debounce]);

  useEffect(() => () => {
    unmountedRef.current = true;
    clearTimeout(timeoutRef.current);
  }, []);

  return [options, onSearch, busy];
};
