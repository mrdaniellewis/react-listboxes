import { tokenise } from './tokenise.js';
import { optionise } from './optionise.js';

export const makeSearch = (options) => {
  const indexed = options.map(optionise).map(({ label }) => label).map(tokenise);

  return (query) => {
    if (!query || !query.trim()) {
      return options;
    }

    const tokenised = tokenise(query);
    return indexed
      .map((tokens, i) => (
        tokenised.every(token => tokens.some(part => part.indexOf(token) === 0))
          ? options[i]
          : null
      ))
      .filter(Boolean);
  };
};
