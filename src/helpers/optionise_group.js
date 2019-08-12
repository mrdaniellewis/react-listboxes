import { groupKeyPrefix } from '../constants/group_key_prefix.js';

export const optioniseGroup = (item) => {
  if (item === null || item === undefined) {
    return { identity: undefined };
  }

  if (typeof item === 'object') {
    return {
      options: [],
      ...item,
      identity: item.value ?? item.id ?? `${groupKeyPrefix}_${item.label}`,
      value: item,
    };
  }

  // A primitive
  return { label: item, identity: `${groupKeyPrefix}_${item}`, options: [], value: item };
};
