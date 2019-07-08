import { useEffect, useCallback } from 'react';

export function useOnBlur(fn, ref) {
  const onBlur = useCallback(() => {
    Promise.resolve().then(() => {
      if (!ref.current.contains(document.activeElement)) {
        fn();
      }
    });
  }, [fn, ref]);

  useEffect(() => {
    window.addEventListener('focus', onBlur, { passive: true });

    return () => window.removeEventListener('focus', onBlur, { passive: true });
  }, [onBlur]);

  return onBlur;
}
