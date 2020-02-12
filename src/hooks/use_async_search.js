import { useCallback, useMemo, useReducer, useRef } from 'react';
import { optionise } from '../helpers/optionise.js';

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
    if (results === null || lastSearchRef.current !== query) {
      return;
    }
    dispatch({ options: results, busy: false });
  }, [fn, initialOptions]);

  const foundOptions = useMemo(() => (
    options.map((o) => optionise(o))
  ), [options]);

  return [foundOptions, onSearch, busy];
};
