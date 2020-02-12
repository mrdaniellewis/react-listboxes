import { tokenise } from './tokenise.js';

function defaultIndex(option) {
  return option?.label || option || '';
}

export const makeSearch = (options, index = defaultIndex) => {
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
      .filter(Boolean);
  };
};
