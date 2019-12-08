import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_INDEX, SET_LIST_PROPS } from './actions.js';

export function reducer(state, { type, search, focusedIndex, listStyle, listClassName }) {
  switch (type) {
    case SET_SEARCH:
      return { ...state, search, expanded: true };
    case SET_EXPANDED:
      return { ...state, expanded: true };
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
