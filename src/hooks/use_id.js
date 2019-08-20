import { useState } from 'react';

export function useId(id) {
  const [generatedId] = useState(
    id || Array(10).fill().map(() => Math.floor(Math.random() * 36).toString(36)),
  );
  return generatedId;
}
