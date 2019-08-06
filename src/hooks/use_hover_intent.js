import { useCallback } from 'react';

// Logic copied from https://github.com/briancherne/jquery-hoverIntent

const SENSITIVITY = 6;
const INTERVAL = 100;

export function useHoverIntent(fn) {
  return useCallback((e) => {
    const { target } = e;
    let x1 = e.pageX;
    let y1 = e.pageY;
    let timeout;

    function compare(x2, y2) {
      if (Math.sqrt(((x1 - x2) ** 2) + ((y1 - y2) ** 2)) < SENSITIVITY) {
        fn();
      } else {
        const [x3, y3] = [x1, y1];
        timeout = setTimeout(() => compare(x3, y3), INTERVAL);
      }
    }

    function onMove(moveEvent) {
      x1 = moveEvent.pageX;
      y1 = moveEvent.pageY;
    }

    function cleanUp() {
      clearTimeout(timeout);
      target.removeEventListener('mouseleave', cleanUp, { passive: true });
      target.removeEventListener('mousemove', onMove, { passive: true });
    }

    e.target.addEventListener('mouseleave', cleanUp, { passive: true });
    e.target.addEventListener('mousemove', onMove, { passive: true });
    const [x2, y2] = [x1, y1];
    setTimeout(() => compare(x2, y2), INTERVAL);
  }, [fn]);
}
