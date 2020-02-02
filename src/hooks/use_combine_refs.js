import { useCallback } from 'react';

export function useCombineRefs(...refs) {
  return useCallback((value) => {
    refs.forEach((ref) => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref) {
        ref.current = value; // eslint-disable-line no-param-reassign
      }
    });
  }, [...refs]); // eslint-disable-line react-hooks/exhaustive-deps
}
