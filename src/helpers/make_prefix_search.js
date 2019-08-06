import { optionise } from './optionise.js';
import { toSearchableString } from './to_searchable_string.js';

export const makePrefixSearch = (options) => {
  const indexed = options.map(optionise).map(({ label }) => label).map(toSearchableString);

  return (query) => {
    if (!query || !query.trim()) {
      return options;
    }

    const clean = toSearchableString(query);
    return indexed.filter(text => text.startsWith(clean));
  };
};
