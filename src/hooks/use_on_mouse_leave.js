import { useCallback } from 'react';

export function useOnMouseLeave(fn, ...refs) {
  return useCallback(() => {
    let left = true;
    const els = refs.map(({ current }) => current);
    const onMouseEnter = () => {
      left = false;
    };

    els.forEach(el => (
      el.addEventListener('mouseenter', onMouseEnter, { passive: true })
    ));

    setTimeout(() => {
      if (left) {
        fn();
      }
      els.forEach(el => (
        el.removeEventListener('mouseenter', onMouseEnter, { passive: true })
      ));
    }, 500);
  }, [fn]); // eslint-disable-line react-hooks/exhaustive-deps
}
