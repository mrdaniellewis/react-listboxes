import { SET_ACTIVE, SET_SEARCH, SET_EXPANDED, SET_INACTIVE, SET_SELECTED_INDEX } from './actions.js';

export function reducer(state, { type, expanded, search, selectedIndex }) {
  switch (type) {
    case SET_ACTIVE:
      return { ...state, search, expanded: true, listBoxFocused: false };
    case SET_SEARCH:
      return { ...state, search };
    case SET_EXPANDED:
      return { ...state, expanded, listBoxFocused: expanded ? state.listBoxFocused : false };
    case SET_INACTIVE:
      return { ...state, expanded: false, search, listBoxFocused: false };
    case SET_SELECTED_INDEX:
      return { ...state, selectedIndex, expanded: true };
    default:
      throw new Error(`${type} unknown`);
  }
}
