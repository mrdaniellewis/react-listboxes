import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_SELECTED_VALUE } from './actions.js';

export function reducer(state, { type, expanded, key, selectedValue }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded, selectedValue: expanded ? state.selectedValue : null };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key };
    case SET_SELECTED_VALUE:
      return { ...state, selectedValue, expanded: true };
    default:
      throw new Error(`${type} unknown`);
  }
}
