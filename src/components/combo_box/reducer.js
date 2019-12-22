import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_INDEX, SET_LIST_PROPS } from './actions.js';

export function reducer(
  state,
  { expanded, focusedIndex = state.focusedIndex, listClassName, listStyle, search, type },
) {
  switch (type) {
    case SET_SEARCH:
      return { ...state, search, expanded: true, focusListBox: false, focusedIndex };
    case SET_EXPANDED:
      return { ...state, expanded, focusedIndex };
    case SET_CLOSED:
      return { ...state, expanded: false, search: null, focusListBox: false, focusedIndex: null };
    case SET_FOCUSED_INDEX:
      return { ...state, focusedIndex, focusListBox: focusedIndex !== null && expanded };
    case SET_LIST_PROPS:
      return { ...state, listStyle, listClassName };
    default:
      throw new Error(`${type} unknown`);
  }
}
