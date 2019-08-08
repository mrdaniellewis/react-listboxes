import { groupKeyPrefix } from '../constants/group_key_prefix.js';

export const optioniseGroup = (item) => {
  if (item === null || item === undefined) {
    return undefined;
  }

  if (typeof item === 'object') {
    return {
      ...item,
      key: item.key ?? item.id ?? item.value ?? `${groupKeyPrefix}_${item.label}`,
      options: undefined,
    };
  }

  // A primitive
  return { label: item, key: `${groupKeyPrefix}_${item}` };
};
