import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_SELECTED_VALUE, SET_SELECTED, SET_MOUSE_OVER } from './actions.js';

export function reducer(state, { type, expanded, key, selectedValue, mouseOver }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded };
    case SET_SELECTED:
      return { ...state, expanded: false, selectedValue };
    case SET_SELECTED_VALUE:
      return { ...state, selectedValue, expanded: true };
    case SET_MOUSE_OVER:
      return { ...state, mouseOver };
    default:
      throw new Error(`${type} unknown`);
  }
}
