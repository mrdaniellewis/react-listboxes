import { SET_EXPANDED, SET_SEARCH_KEY, CLEAR_SEARCH } from './actions.js';

export function reducer(state, { type, expanded, key }) {
  switch (type) {
    case SET_EXPANDED:
      if (expanded === state.expanded) {
        return state;
      }
      return { ...state, expanded };
    case CLEAR_SEARCH:
      return { ...state, search: '' };
    case SET_SEARCH_KEY:
      return { ...state, search: (state.search || '') + key };
    default:
      throw new Error(`${type} unknown`);
  }
}
