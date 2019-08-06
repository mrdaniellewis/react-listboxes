import { rSpace } from '../constants/r_space.js';
import { toSearchableString } from './to_searchable_string.js';

export function tokenise(item) {
  return toSearchableString(item)
    .split(rSpace)
    .filter(Boolean);
}
