import { useCallback, useState, useRef } from 'react';
import { optionise } from '../helpers/optionise.js';

export const useAsyncSearch = (search, initialOptions = []) => {
  const [options, setOptions] = useState(() => initialOptions.map(optionise));
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const lastSearch = useRef(null);
  const onSearch = useCallback(async (query) => {
    lastSearch.current = query;
    const timeout = setTimeout(() => {
      if (lastSearch.current === query) {
        setBusy(true);
      }
    }, 200);

    let results;
    try {
      results = await search(query);
    } catch (e) {
      console.error(e); // eslint-disable-line no-console
      setError(e);
      setBusy(false);
      return;
    }
    // Discard out of sequence results
    clearTimeout(timeout);
    if (lastSearch.current !== query) {
      return;
    }
    setBusy(false);
    if (results === null) {
      return;
    }
    setOptions(results.map(optionise));
  }, [search]);

  return { options, busy, onSearch, error };
};
