export const optionise = (item) => {
  if (Array.isArray(item)) {
    return { label: item[1], identity: item[0], value: item };
  }

  if (item === null || item === undefined) {
    return { label: '', identity: '', value: item };
  }

  if (typeof item === 'object') {
    return { ...item, identity: item.value ?? item.id ?? item.label, value: item };
  }

  // A primitive
  return { label: item, identity: item, value: item };
};
