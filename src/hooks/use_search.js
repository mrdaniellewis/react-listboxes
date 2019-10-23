import { useMemo, useState } from 'react';
import { makeSearch } from '../helpers/make_search.js';
import { optionise } from '../helpers/optionise.js';

export const useSearch = (rawOptions) => {
  const options = useMemo(() => rawOptions.map(optionise), [rawOptions]);
  const [filteredOptions, setFilteredOptions] = useState(rawOptions);
  const onSearch = useMemo(() => {
    const search = makeSearch(options);
    return (query) => setFilteredOptions(search(query));
  }, [options]);

  return [filteredOptions, onSearch];
};
