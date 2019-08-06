import { toNormalizedString } from './to_normalized_string.js';
import { rPunctuation } from '../constants/r_punctuation.js';
import { rSpace } from '../constants/r_space.js';

export function toSearchableString(text) {
  return toNormalizedString(text)
    .trim()
    .toLowerCase()
    .replace(rPunctuation)
    .replace(rSpace, ' ');
}
