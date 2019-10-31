import { useCallback, useEffect } from 'react';

export function useOnBlur(fn, ref) {
  const callback = useCallback(() => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        fn();
      }
    }, 0);
  }, [fn, ref]);

  useEffect(() => {
    window.addEventListener('focus', callback, { passive: true });

    return () => {
      window.removeEventListener('focus', callback, { passive: true });
    };
  }, [callback]);

  return callback;
}
