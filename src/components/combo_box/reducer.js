import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_INDEX, SET_LIST_PROPS } from './actions.js';

export function reducer(state, { expanded, type, search, focusedIndex, listStyle, listClassName, autocomplete }) {
  switch (type) {
    case SET_SEARCH:
      return { ...state, search, expanded: true, focusedIndex: null, autocomplete };
    case SET_EXPANDED:
      return { ...state, expanded, autocomplete: '' };
    case SET_CLOSED:
      return { ...state, expanded: false, focusedIndex: null, search: null, autocomplete: '' };
    case SET_FOCUSED_INDEX:
      return { ...state, focusedIndex, autocomplete };
    case SET_LIST_PROPS:
      return { ...state, listStyle, listClassName };
    default:
      throw new Error(`${type} unknown`);
  }
}
