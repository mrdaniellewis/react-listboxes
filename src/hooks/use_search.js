import { useMemo, useState } from 'react';
import { makeSearch } from '../helpers/make_search.js';

export const useSearch = (options, index) => {
  const [filteredOptions, setFilteredOptions] = useState(options);
  const onSearch = useMemo(() => {
    const search = makeSearch(options, index);
    return (query) => setFilteredOptions(search(query));
  }, [options, index]);

  return [filteredOptions, onSearch];
};
