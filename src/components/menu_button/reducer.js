import { SET_EXPANDED, SET_SELECTED_INDEX } from './actions.js';

export function reducer(state, { type, expanded, selectedIndex }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded, selectedIndex: -1 };
    case SET_SELECTED_INDEX:
      return { ...state, expanded: true, selectedIndex };
    default:
      throw new Error(`${type} unknown`);
  }
}
