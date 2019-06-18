import { SET_EXPANDED } from './actions';

export function reducer(state, { type, expanded }) {
  switch (type) {
    case SET_EXPANDED:
      return { ...state, expanded };
    default:
      throw new Error(`${type} unknown`);
  }
}
