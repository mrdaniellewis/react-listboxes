import { useState } from 'react';

let count = 0;
const prefix = Array(8).fill().map(() => Math.floor(Math.random() * 36).toString(36)).join('');

export function useId(initialId) {
  const [id] = useState(() => {
    if (initialId) {
      return initialId;
    }
    return `${prefix}_${count++}`; // eslint-disable-line no-plusplus
  });
  return id;
}
