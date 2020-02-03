import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_INDEX, SET_LIST_PROPS } from './actions.js';

export function reducer(
  state,
  props,
  {
    expanded, focusedIndex = state.focusedIndex, listClassName,
    listStyle, search, type, inlineAutoComplete = false, focusListBox = false,
  },
) {
  switch (type) {
    case SET_SEARCH:
      return {
        ...state,
        search,
        expanded: true,
        focusListBox: false,
        focusedIndex,
        focusedIdentity: props.options[focusedIndex]?.identity,
        inlineAutoComplete,
      };
    case SET_EXPANDED:
      return {
        ...state,
        expanded,
        focusedIndex,
        focusedIdentity: props.options[focusedIndex]?.identity,
      };
    case SET_CLOSED:
      return {
        ...state,
        expanded: false,
        search: null,
        focusListBox: false,
        focusedIndex: null,
        focusedIdentity: undefined,
        autoComplete: false,
        inlineAutoComplete: false,
      };
    case SET_FOCUSED_INDEX:
      return {
        ...state,
        focusedIndex,
        focusedIdentity: props.options[focusedIndex]?.identity,
        focusListBox,
        inlineAutoComplete,
      };
    case SET_LIST_PROPS:
      return {
        ...state,
        listStyle,
        listClassName,
      };

    default:
      throw new Error(`${type} unknown`);
  }
}
