import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_SELECTED_INDEX } from './actions.js';

export function reducer(state, { type, expanded, key, selectedIndex }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded, selectedIndex: expanded ? -1 : state.selectedIndex };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key };
    case SET_SELECTED_INDEX:
      return { ...state, selectedIndex, expanded: true };
    default:
      throw new Error(`${type} unknown`);
  }
}
