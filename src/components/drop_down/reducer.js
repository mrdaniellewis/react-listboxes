import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_FOCUSED_INDEX, SET_SELECTED } from './actions.js';

export function reducer(state, { type, expanded, key, focusedIndex }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key.toLowerCase() };
    case SET_SELECTED:
      return { ...state, expanded: false, focusedIndex: null };
    case SET_FOCUSED_INDEX:
      return { ...state, focusedIndex, expanded: true };
    default:
      throw new Error(`${type} unknown`);
  }
}
