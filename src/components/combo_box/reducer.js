import { SET_EXPANDED, SET_SEARCH } from './actions.js';

export function reducer(state, { type, expanded, search }) {
  switch (type) {
    case SET_EXPANDED:
      if (expanded === state.expanded) {
        return state;
      }
      return { ...state, expanded };
    case SET_SEARCH:
      return { ...state, search };
    default:
      throw new Error(`${type} unknown`);
  }
}
