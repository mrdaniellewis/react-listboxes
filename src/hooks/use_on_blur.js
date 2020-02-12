import { useCallback, useEffect, useState, useRef } from 'react';

/**
 * This generates blur and focus
 * handlers that fire if the focus moves from within an element and does not return
 */
export function useOnBlur(fn, ref) {
  const [focus, setFocus] = useState(false);
  const timeoutRef = useRef();

  // Ensure the timeout does not run after unmounting
  useEffect(() => {
    clearTimeout(timeoutRef.current);
  }, []);

  const onBlur = useCallback(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if (ref.current && !ref.current.contains(document.activeElement)) {
        fn();
        setFocus(false);
      }
    }, 0);
  }, [fn, ref]);

  const onFocus = useCallback(() => {
    setFocus(true);
  }, []);

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
