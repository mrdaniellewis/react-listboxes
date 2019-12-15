import { useState } from 'react';
import { name, version } from '../../package.json';

let count = 0;

export function useId(initialId) {
  const [id] = useState(() => {
    if (initialId) {
      return initialId;
    }
    return `${name}${version}_id_${count++}`; // eslint-disable-line no-plusplus
  });
  return id;
}
