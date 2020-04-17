import { useCallback } from 'react';
import { useConfineListBox } from './use_confine_list_box.js';

export function useConfineListBoxTable(selector) {
  const [style, originalOnLayoutListBox] = useConfineListBox(selector);

  const onLayoutListBox = useCallback((props) => {
    originalOnLayoutListBox({ ...props, listbox: props.listbox?.parentNode });
  }, [originalOnLayoutListBox]);

  return [style, onLayoutListBox];
}
