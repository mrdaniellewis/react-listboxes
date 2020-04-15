import { useMemo } from 'react';
import { tokenSearcher } from '../searchers/token_searcher.js';
import { useSearch } from './use_search.js';

export function useTokenSearch(options, { index, tokenise, minLength } = {}) {
  const search = useMemo(() => (
    tokenSearcher(options, { index, tokenise })
  ), [options, index, tokenise]);

  const [filteredOptions, onSearch] = useSearch(search, { initialOptions: options, minLength });
  return [filteredOptions, onSearch, false];
}
