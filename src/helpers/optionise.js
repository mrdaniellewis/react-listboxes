export const optionise = (item) => {
  if (Array.isArray(item)) {
    return { label: item[1], identity: item[0], value: item };
  }

  if (item === null || item === undefined) {
    return { label: '', identity: '', value: item };
  }

  if (typeof item === 'object') {
    const { label, group, value, options: _, disabled, node, ...html } = item;
    return {
      label,
      group,
      disabled,
      identity: value ?? item.id ?? item.label,
      value: item,
      options: undefined,
      node,
      html,
    };
  }

  // A primitive
  return { label: item, identity: item, value: item };
};
