import { tokenise } from './tokenise.js';

export const search = (indexed, collection, query) => {
  if (!query || !query.trim()) {
    return collection;
  }
  const tokenised = tokenise(query);
  return indexed
    .map((tokens, i) => (
      tokenised.every(token => tokens.some(part => part.indexOf(token) === 0))
        ? collection[i]
        : null
    ))
    .filter(Boolean);
};
