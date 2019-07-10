import { useEffect, useCallback } from 'react';

export function useOnBlur(fn, ref) {
  const onBlur = useCallback(() => {
    setTimeout(() => {
      if (!ref.current.contains(document.activeElement)) {
        fn();
      }
    }, 0);
  }, [fn, ref]);

  useEffect(() => {
    window.addEventListener('focus', onBlur, { passive: true });

    return () => window.removeEventListener('focus', onBlur, { passive: true });
  }, [onBlur]);

  return onBlur;
}
