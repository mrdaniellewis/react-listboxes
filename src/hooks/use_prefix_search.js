import { useMemo } from 'react';
import { prefixSearcher } from '../searchers/prefix_searcher.js';
import { useSearch } from './use_search.js';

export function usePrefixSearch(options, { index }) {
  const search = useMemo(() => (
    prefixSearcher(options, { index })
  ), [options, index]);

  const [filteredOptions, onSearch] = useSearch(search, { initialOptions: options });
  return [filteredOptions, onSearch, false];
}
