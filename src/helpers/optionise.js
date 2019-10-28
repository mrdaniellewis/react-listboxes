export const optionise = (rawOption, mapOption) => {
  const option = mapOption ? mapOption(rawOption) : rawOption;
  if (option !== null && typeof option === 'object') {
    const { label, group, value, disabled, node, html } = option;
    return {
      label,
      group,
      disabled,
      identity: value ?? option.id ?? option.label,
      value: option,
      node,
      html: { ...html },
    };
  }

  // A primitive
  return { label: option ?? '', identity: option, value: option };
};
