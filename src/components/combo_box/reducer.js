import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_INDEX, SET_LIST_PROPS } from './actions.js';

export function reducer(state, { expanded, type, search, focusedIndex, listStyle, listClassName }) {
  switch (type) {
    case SET_SEARCH:
      return { ...state, search, expanded: true, focusedIndex: null };
    case SET_EXPANDED:
      return { ...state, expanded };
    case SET_CLOSED:
      return { ...state, expanded: false, focusedIndex: null, search: null };
    case SET_FOCUSED_INDEX:
      return { ...state, focusedIndex };
    case SET_LIST_PROPS:
      return { ...state, listStyle, listClassName };
    default:
      throw new Error(`${type} unknown`);
  }
}
