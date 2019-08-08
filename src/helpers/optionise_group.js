import { groupKeyPrefix } from '../constants/group_key_prefix.js';

export const optioniseGroup = (item) => {
  if (item === null || item === undefined) {
    return undefined;
  }

  if (typeof item === 'object') {
    return {
      ...item,
      identity: item.value ?? item.id ?? `${groupKeyPrefix}_${item.label}`,
      options: undefined,
      value: item,
    };
  }

  // A primitive
  return { label: item, identity: `${groupKeyPrefix}_${item}`, value: item };
};
