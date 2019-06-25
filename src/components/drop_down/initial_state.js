import { reducer } from './reducer.js';
import { SET_OPTIONS } from './actions.js';

export function initialState() {
  return {
    expanded: false,
    search: '',
  };
}
