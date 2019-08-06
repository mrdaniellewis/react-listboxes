import { useEffect, useCallback, useRef } from 'react';
import { addEventOnce } from '../helpers/add_event_once.js';

export function useOnBlur(fn, ref) {
  const mouseDownRef = useRef(false);

  const onBlur = useCallback(() => {
    setTimeout(() => {
      if (!mouseDownRef.current && !ref.current.contains(document.activeElement)) {
        fn();
      }
    }, 0);
  }, [fn, ref]);

  const onMouseDown = useCallback(() => {
    mouseDownRef.current = true;
    addEventOnce(document, 'mouseup', () => {
      mouseDownRef.current = false;
      onBlur();
    }, { passive: true });
  }, [onBlur]);

  useEffect(() => {
    window.addEventListener('focus', onBlur, { passive: true });
    document.addEventListener('mousedown', onMouseDown, { passive: true });

    return () => {
      window.removeEventListener('focus', onBlur, { passive: true });
      document.removeEventListener('mousedown', onMouseDown, { passive: true });
    };
  }, [onBlur, onMouseDown]);

  return onBlur;
}
