import { tokenise as defaultTokenise } from '../helpers/tokenise.js';
import { indexValue } from '../helpers/index_value.js';

export function tokenSearcher(
  options,
  { index = indexValue, tokenise = defaultTokenise } = {},
) {
  const indexed = options.map((o) => tokenise(index(o)));

  return (query) => {
    if (!query || !query.trim()) {
      return options;
    }

    const tokenised = tokenise(query);
    return indexed
      .map((tokens, i) => (
        tokenised.every((token) => tokens.some((part) => part.indexOf(token) === 0))
          ? options[i]
          : null
      ))
      .filter((o) => o !== null && o !== '');
  };
}