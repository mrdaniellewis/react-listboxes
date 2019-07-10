import { CLEAR_SEARCH, SET_ACTIVE, SET_EXPANDED, SET_SEARCH } from './actions.js';

export function reducer(state, { type, expanded, search }) {
  switch (type) {
    case SET_ACTIVE:
      return { ...state, search, expanded: true };
    case SET_SEARCH:
      return { ...state, search };
    case SET_EXPANDED:
      if (expanded === state.expanded) {
        return state;
      }
      return { ...state, expanded };
    case CLEAR_SEARCH:
      return { ...state, expanded: false, search: null };
    default:
      throw new Error(`${type} unknown`);
  }
}
