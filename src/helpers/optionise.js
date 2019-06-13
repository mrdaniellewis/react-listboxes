export const optionise = (item) => {
  if (Array.isArray(item)) {
    return { value: item[0], label: item[1] };
  }

  if (item === null || item === undefined) {
    return { value: item, label: '' };
  }

  if (typeof item === 'object') {
    return item;
  }

  // A primitive
  return { value: item, label: item };
};
