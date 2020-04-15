import { indexValue } from '../helpers/index_value.js';
import { tokenSearcher } from './token_searcher.js';

function tokenise(text) {
  return [text.trimLeft().toLowerCase()];
}

export function prefixSearcher(options, { index = indexValue } = {}) {
  return tokenSearcher(options, { index, tokenise });
}
