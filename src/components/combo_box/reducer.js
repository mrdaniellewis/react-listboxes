import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_SELECTED_OPTION, SET_LIST_PROPS } from './actions.js';

export function reducer(state, props, { type, ...params }) {
  switch (type) {
    case SET_SEARCH: {
      const { search } = params;
      const selectedOption = search ? state.selectedOption : null;
      return {
        ...state,
        search,
        selectedOption,
        expanded: true,
        focusListBox: false,
      };
    }
    case SET_EXPANDED: {
      const { expanded } = params;

      return {
        ...state,
        expanded,
      };
    }
    case SET_CLOSED:
      return {
        ...state,
        expanded: false,
        focusListBox: false,
        search: null,
        autoComplete: false,
        inlineAutoComplete: false,
      };
    case SET_SELECTED_OPTION: {
      const {
        selectedOption,
        focusListBox = state.focusListBox,
      } = params;
      return {
        ...state,
        expanded: true,
        focusListBox: selectedOption ? focusListBox : false,
        selectedOption,
      };
    }
    case SET_LIST_PROPS: {
      const { listStyle, listClassName } = params;
      return {
        ...state,
        listStyle,
        listClassName,
      };
    }

    default:
      throw new Error(`${type} unknown`);
  }
}
