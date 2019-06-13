import { CLOSE_LISTBOX, OPEN_LISTBOX } from '../actions.js';

export const reduceListbox = (state, { type }) => {
  if (type === CLOSE_LISTBOX) {
    return { open: false, selectedIndex: null };
  }
  if (type === OPEN_LISTBOX) {
    return { open: true };
  }
  return null;
};
