import { reducer } from './reducer.js';
import { SET_OPTIONS } from './actions.js';

export function initialState({ busy, options, value }) {
  return reducer(
    {
      busy,
      expanded: false,
    },
    {
      type: SET_OPTIONS,
      options,
      value,
    },
  );
}
