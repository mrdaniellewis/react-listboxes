import { useCallback, useReducer, useRef, useEffect } from 'react';

export function useSearch(fn, { initialOptions, debounce, minLength }) {
  const [{ options, busy }, dispatch] = useReducer(
    (state, action) => ({ ...state, ...action }),
    { options: initialOptions || [], busy: false },
  );

  const lastSearchRef = useRef();
  const timeoutRef = useRef();
  const unmountedRef = useRef(false);

  const search = useCallback(async (query) => {
    dispatch({ busy: true });
    const results = await fn(query);
    // Prevent out of sync returns clobbering the results
    if (lastSearchRef.current !== query || unmountedRef.current) {
      return;
    }
    if (results === null) {
      dispatch({ busy: null });
      return;
    }
    dispatch({ options: results, busy: false });
  }, [fn]);

  const onSearch = useCallback((query) => {
    if (!query && initialOptions) {
      dispatch({ options: initialOptions, busy: false });
      return;
    }
    lastSearchRef.current = query;
    dispatch({ busy: null });
    if (minLength && query.length < minLength) {
      return;
    }

    if (debounce) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        search(query);
      }, debounce);
    } else {
      search(query);
    }
  }, [initialOptions, search, debounce, minLength]);

  useEffect(() => () => {
    unmountedRef.current = true;
    clearTimeout(timeoutRef.current);
  }, []);

  return [options, onSearch, busy];
}
