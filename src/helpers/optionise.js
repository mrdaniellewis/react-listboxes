export const optionise = (item) => {
  if (Array.isArray(item)) {
    return { label: item[1], key: item[0], value: item };
  }

  if (item === null || item === undefined) {
    return { label: '', key: '', value: item };
  }

  if (typeof item === 'object') {
    return { ...item, key: item.id ?? item.value ?? item.label, value: item };
  }

  // A primitive
  return { label: item, key: item, value: item };
};
