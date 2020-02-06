import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH, SET_FOCUSED_OPTION, SET_SELECTED, SET_LIST_PROPS } from './actions.js';

export function reducer(
  state,
  props,
  { type, expanded, key, focusedOption, listStyle, listClassName },
) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key.toLowerCase() };
    case SET_SELECTED:
      return { ...state, expanded: false, focusedOption: null };
    case SET_FOCUSED_OPTION:
      return { ...state, focusedOption, expanded: true };
    case SET_LIST_PROPS:
      return { ...state, listStyle, listClassName };
    /* istanbul ignore next */
    default:
      throw new Error(`${type} unknown`);
  }
}
