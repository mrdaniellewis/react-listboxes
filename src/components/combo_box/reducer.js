import { SET_ACTIVE, SET_SEARCH, SET_EXPANDED, SET_INACTIVE } from './actions.js';

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
    case SET_INACTIVE:
      return { ...state, expanded: false, search };
    default:
      throw new Error(`${type} unknown`);
  }
}
