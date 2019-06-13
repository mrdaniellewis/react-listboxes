import { reduceFocus } from './reducers/reduce-focus.js';
import { reduceMove } from './reducers/reduce-move.js';
import { reduceProps } from './reducers/reduce-props.js';
import { reduceListbox } from './reducers/reduce-listbox.js';

export const reducer = (state, action) => ({
  ...state,
  ...reduceMove(state, action),
  ...reduceFocus(state, action),
  ...reduceProps(state, action),
  ...reduceListbox(state, action),
});
