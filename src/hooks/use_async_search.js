import { useCallback, useMemo, useState } from 'react';
import { optionise } from '../helpers/optionise.js';

export const useAsyncSearch = (fn, { initialOptions = [] }) => {
  const [busy, setBusy] = useState(false);
  const [options, setOptions] = useState(initialOptions);

  const onSearch = useCallback(async (query) => {
    console.log('search', query);
    if (!query) {
      setOptions(initialOptions);
      return;
    }
    setBusy(true);
    const results = await fn(query);
    setBusy(false);
    if (results === null) {
      return;
    }
    setOptions(results);
  }, [fn, initialOptions]);

  const foundOptions = useMemo(() => (
    options.map((o) => optionise(o))
  ), [options]);

  return [foundOptions, onSearch, busy];
};
