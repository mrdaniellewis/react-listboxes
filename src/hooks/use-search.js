import { useCallback, useMemo, useState } from 'react';
import { tokenise } from '../helpers/tokenise.js';
import { optionise } from '../helpers/optionise.js';
import { search } from '../helpers/search.js';

export const useSearch = (collection, { key = 'label' } = {}) => {
  const [options, updateOptions] = useState(collection);
  const indexed = useMemo(
    () => collection.map(option => tokenise(optionise(option)[key])),
    [collection, key],
  );
  const onSearch = useCallback(
    term => updateOptions(search(indexed, collection, term)),
    [indexed, collection],
  );
  return [options, onSearch];
};
