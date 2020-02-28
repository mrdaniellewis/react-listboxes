import { useMemo } from 'react';
import { makeSearch } from '../helpers/make_search.js';
import { useSearch } from './use_search.js';

export const useTokenSearch = (options, index) => {
  const search = useMemo(() => (
    makeSearch(options, index)
  ), [options, index]);

  return useSearch(search, { initialOptions: options });
};
