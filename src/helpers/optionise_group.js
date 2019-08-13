import { groupKeyPrefix } from '../constants/group_key_prefix.js';

export const optioniseGroup = (item) => {
  if (typeof item === 'object') {
    const { label, options = [], value, node, ...html } = item;
    return {
      options,
      label,
      identity: value ?? item.id ?? `${groupKeyPrefix}_${item.label}`,
      value: item,
      node,
      html,
    };
  }

  // A primitive
  return { label: item, identity: `${groupKeyPrefix}_${item}`, options: [], value: item };
};
