import { useMemo } from 'react';
import { prefixSearcher } from '../searchers/prefix_searcher.js';
import { useSearch } from './use_search.js';

export function usePrefixSearch(options, { index, ...more } = {}) {
  const search = useMemo(() => (
    prefixSearcher(options, { index })
  ), [options, index]);

  const [filteredOptions, onSearch, busy] = useSearch(search, { initialOptions: options, ...more });
  return [filteredOptions, onSearch, busy];
}
