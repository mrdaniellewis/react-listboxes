import { SET_BUSY, SET_EXPANDED, SET_OPTIONS } from './actions.js';

export function reducer(state, { busy, type, expanded, options, value }) {
  switch (type) {
    case SET_EXPANDED:
      if (expanded === state.expanded) {
        return state;
      }
      return { ...state, expanded };
    default:
      throw new Error(`${type} unknown`);
  }
}
