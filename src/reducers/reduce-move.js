import { SELECT_NEXT, SELECT_PREVIOUS, SELECT_FIRST, SELECT_LAST } from '../actions.js';

export const reduceMove = (state, { type, fromIndex }) => {
  const { selectedIndex, options, pluckDisabled } = state;
  switch (type) {
    case SELECT_NEXT: {
      let index = fromIndex === null ? -1 : fromIndex;
      do {
        index += 1;
        if (index >= options.length) {
          index = null;
          break;
        }
      } while (pluckDisabled(options[selectedIndex]));
      return { selectedIndex: index, open: true };
    }
    case SELECT_PREVIOUS: {
      let index = fromIndex === null ? options.length : fromIndex;
      do {
        index -= 1;
        if (index < 0) {
          index = null;
          break;
        }
      } while (pluckDisabled(options[selectedIndex]));
      return { selectedIndex: index, open: true };
    }
    case SELECT_FIRST:
      return reduceMove(state, { type: SELECT_NEXT, fromIndex: null });
    case SELECT_LAST:
      return reduceMove(state, { type: SELECT_PREVIOUS, fromIndex: null });
    default:
      return null;
  }
};
