import { useCallback, useEffect, useState } from 'react';

/**
 * This generates blur and focus
 * handlers that fire if the focus moves from within an element and does not return
 */
export function useOnBlur(fn, ref) {
  const [focus, onFocus] = useState(false);

  const onBlur = useCallback(() => {
    setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        fn();
      }
    }, 0);
  }, [fn, ref]);

  useEffect(() => {
    if (!focus) {
      return undefined;
    }
    window.addEventListener('focus', onBlur, { passive: true });

    return () => {
      window.removeEventListener('focus', onBlur, { passive: true });
    };
  }, [onBlur, focus]);

  return [onBlur, onFocus];
}
