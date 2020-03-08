import { useState, useEffect, useCallback } from 'react';

function calculateMaxWidth(listbox, selector) {
  const contained = listbox.closest(selector) || document.body;
  const listboxBounding = listbox.getBoundingClientRect();
  const extras = Math.ceil(listboxBounding.width - listbox.clientWidth)
    + parseFloat(getComputedStyle(listbox).marginRight);
  const maxWidth = `${contained.getBoundingClientRect().right - extras - listboxBounding.left}px`;
  return maxWidth;
}

function calculateMaxHeight(listbox) {
  const currentMaxHeight = listbox.style.maxHeight;
  listbox.style.maxHeight = ''; // eslint-disable-line no-param-reassign
  const listboxBounding = listbox.getBoundingClientRect();
  const windowEnd = window.innerHeight;
  let maxHeight = '';
  if (listboxBounding.bottom > windowEnd) {
    const extras = Math.ceil(listboxBounding.height - listbox.clientHeight)
      + parseFloat(getComputedStyle(listbox).marginBottom);
    const newHeight = listboxBounding.height - (listboxBounding.bottom - windowEnd) - extras;
    const newMaxHeight = Math.max(newHeight, 0);
    maxHeight = `${newMaxHeight}px`;
  }
  listbox.style.maxHeight = currentMaxHeight; // eslint-disable-line no-param-reassign
  return maxHeight;
}

export function useConfine(selector = 'body') {
  const [style, setStyle] = useState({});
  const [handler, setHandler] = useState(null);

  // Called when the list box is opened, closed, or the options or selected option changes
  const layoutListBox = useCallback(({ expanded, listbox }) => {
    const updateProps = () => {
      if (!expanded || !listbox) {
        return;
      }

      setStyle({
        maxWidth: calculateMaxWidth(listbox, selector),
        maxHeight: calculateMaxHeight(listbox),
      });
    };

    updateProps();
    setHandler(() => updateProps);
  }, [selector]);

  useEffect(() => {
    if (!handler) {
      return undefined;
    }
    window.addEventListener('resize', handler, { passive: true });
    window.addEventListener('scroll', handler, { passive: true });
    return () => {
      window.removeEventListener('resize', handler, { passive: true });
      window.removeEventListener('scroll', handler, { passive: true });
    };
  }, [handler]);

  return [style, layoutListBox];
}
