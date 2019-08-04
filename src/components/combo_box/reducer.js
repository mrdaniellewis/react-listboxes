import { SET_ACTIVE, SET_EXPANDED, SET_INACTIVE, SET_SELECTED, SET_SELECTED_VALUE } from './actions.js';

export function reducer(state, { type, expanded, search, selectedValue }) {
  switch (type) {
    case SET_ACTIVE:
      return { ...state, search, expanded, listBoxFocused: false, selectedValue, focused: true };
    case SET_INACTIVE:
      return { ...state, expanded: false, focused: false, listBoxFocused: false };
    case SET_EXPANDED:
      return { ...state, expanded, listBoxFocused: expanded ? state.listBoxFocused : false };
    case SET_SELECTED:
      return { ...state, expanded: false, selectedValue, search, listBoxFocused: false };
    case SET_SELECTED_VALUE:
      return { ...state, selectedValue, expanded: true, listBoxFocused: !!selectedValue };
    default:
      throw new Error(`${type} unknown`);
  }
}
