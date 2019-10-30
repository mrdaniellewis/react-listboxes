import { useState } from 'react';
import { name, version } from '../../package.json';

let count = 0;

export function useId(initialId) {
  const [id] = useState(() => {
    if (initialId) {
      return initialId;
    }
    return `${name}_${version}_id_${count++}`.replace(/[^a-z0-9_-]/g, '_'); // eslint-disable-line no-plusplus
  });
  return id;
}
