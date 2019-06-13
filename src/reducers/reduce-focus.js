import { INPUT_FOCUS, COMPONENT_BLUR } from '../actions.js';

export const reduceFocus = ({ options, busy }, { type }) => {
  if (type === INPUT_FOCUS) {
    const open = !!options.length && !busy;
    return { focused: true, open };
  }
  if (type === COMPONENT_BLUR) {
    return { focused: false, open: false };
  }
  return null;
};
