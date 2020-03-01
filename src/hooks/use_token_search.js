import { useMemo } from 'react';
import { tokenSearcher } from '../searchers/token_searcher.js';
import { useSearch } from './use_search.js';

export function useTokenSearch(options, { index, tokenise } = {}) {
  const search = useMemo(() => (
    tokenSearcher(options, { index, tokenise })
  ), [options, index, tokenise]);

  const [filteredOptions, onSearch] = useSearch(search, { initialOptions: options });
  return [filteredOptions, onSearch, false];
}
