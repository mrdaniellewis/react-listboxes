import { useCallback, useState } from 'react';
import { optionise } from '../helpers/optionise.js';

export const useAsyncSearch = (search, initialOptions = []) => {
  const [options, setOptions] = useState(() => initialOptions.map(optionise));
  const onSearch = useCallback(async (query) => {
    const results = await search(query);
    if (results === null) {
      return;
    }
    setOptions(results.map(optionise));
  }, [search]);

  return [options, onSearch];
};
