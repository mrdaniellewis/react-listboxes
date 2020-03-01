import { indexValue } from '../helpers/index_value.js';
import { tokenSearcher } from './token_searcher.js';
import { toSearchableString } from '../helpers/to_searchable_string.js';

function tokenise(text) {
  return [toSearchableString(text)];
}

export function prefixSearcher(options, { index = indexValue } = {}) {
  return tokenSearcher(options, { index, tokenise });
}
