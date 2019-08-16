import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_SELECTED_VALUE, SET_SELECTED, SET_BUTTON_MOUSE_DOWN } from './actions.js';

export function reducer(state, { type, expanded, key, selectedValue }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key.toLowerCase() };
    case SET_SELECTED:
      return { ...state, expanded: false, selectedValue };
    case SET_SELECTED_VALUE:
      return { ...state, selectedValue, expanded: true };
    case SET_BUTTON_MOUSE_DOWN:
      return { ...state, mouseDown: true };
    default:
      throw new Error(`${type} unknown`);
  }
}
