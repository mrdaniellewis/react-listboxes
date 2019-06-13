import { PROP_CHANGE } from '../actions.js';

export const reduceProps = (oldState, { type, ...props }) => {
  if (type !== PROP_CHANGE) {
    return null;
  }

  const state = { ...oldState, ...props };
  const { busy, options, pluckIdentity, value } = state;
  let { selectedIndex, open } = state;

  if (props.value !== undefined || props.options !== undefined) {
    const valueIdentity = pluckIdentity(value);
    selectedIndex = options.find(option => pluckIdentity(option) === valueIdentity);
  }

  if (props.options && props.options.length && !busy && props.value !== undefined) {
    open = true;
  }

  return { ...props, selectedIndex, open };
};
