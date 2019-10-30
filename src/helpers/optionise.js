export const optionise = (rawOption, mapOption) => {
  const option = mapOption && rawOption != null ? mapOption(rawOption) : rawOption;
  if (option !== null && typeof option === 'object') {
    const { label, group, value, disabled, node, html } = option;
    return {
      label,
      group,
      disabled,
      unselectable: !!disabled,
      identity: value ?? option.id ?? option.label,
      value: rawOption,
      node,
      html: { ...html },
    };
  }

  // A primitive
  return { label: option ?? '', identity: option, value: option, selectable: true };
};
