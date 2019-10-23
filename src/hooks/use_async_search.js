import { useCallback, useReducer, useRef, useState } from 'react';
import { optionise } from '../helpers/optionise.js';
import { debouncerFactory } from '../helpers/debouncer_factory.js';

function reduce(state, action) {
  return { ...state, ...action };
}

function init(initialOptions) {
  return {
    options: initialOptions.map(optionise),
    error: null,
    busy: false,
  };
}

export const useAsyncSearch = (
  search,
  { initialOptions = [], cache = true, debounce = 200 } = {},
) => {
  const [{ options, error, busy }, dispatch] = useReducer(reduce, initialOptions, init);
  const lastSearch = useRef(null);
  const [cacheMap] = useState(new Map());
  const [debouncer] = useState(() => debouncerFactory({ delay: debounce }));
  const onSearch = useCallback((query) => debouncer(async () => {
    lastSearch.current = query;
    const timeout = setTimeout(() => {
      if (lastSearch.current === query) {
        dispatch({ busy: true, error: undefined });
      }
    }, 200);

    let results;
    if (cache) {
      results = cacheMap.get(query);
    }
    if (results === undefined) {
      try {
        results = await search(query);
        if (cache) {
          cacheMap.set(query, results);
        }
      } catch (e) {
        clearTimeout(timeout);
        console.error(e); // eslint-disable-line no-console
        dispatch({ busy: false, error: e.message, options: [] });
        return;
      }
    }
    // Discard out of sequence results
    clearTimeout(timeout);
    if (lastSearch.current !== query) {
      return;
    }
    dispatch({ busy: false });
    if (results === null) {
      return;
    }
    dispatch({ options: results.map(optionise) });
  }), [debouncer, search, cacheMap, cache]);

  return { options, busy, onSearch, error };
};
