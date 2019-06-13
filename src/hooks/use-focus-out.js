import { useEffect, useRef } from 'react';

export const useFocusOut = (fn) => {
  const ref = useRef();

  useEffect(() => {
    let mounted = true;
    const onBlur = (e) => {
      if (e.persist) {
        e.persist();
      }
      setTimeout(() => {
        if (!mounted || ref.current.contains(document.activeElement)) {
          return;
        }
        fn(e);
      }, 0);
    };
    window.addEventListener('blur', onBlur);
    window.addEventListener('focusout', onBlur);

    return () => {
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('focusout', onBlur);
      mounted = false;
    };
  }, [fn]);

  return ref;
};
