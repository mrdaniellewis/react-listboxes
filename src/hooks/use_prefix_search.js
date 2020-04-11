import { useMemo } from 'react';
import { prefixSearcher } from '../searchers/prefix_searcher.js';
import { useSearch } from './use_search.js';

export function usePrefixSearch(options, { index, minLength } = {}) {
  const search = useMemo(() => (
    prefixSearcher(options, { index })
  ), [options, index]);

  const initialOptions = minLength > 0 ? null : options;
  const [filteredOptions, onSearch] = useSearch(search, { initialOptions, minLength });
  return [filteredOptions, onSearch, false];
}
