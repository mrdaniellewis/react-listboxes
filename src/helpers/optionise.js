export function optionise(rawOption, mapOption) {
  const option = mapOption && rawOption != null ? mapOption(rawOption) : rawOption;
  if (option !== null && typeof option === 'object') {
    const { label, group, value, disabled, html } = option;
    return {
      label,
      group,
      disabled: !!disabled,
      unselectable: !!disabled,
      identity: String(value ?? option.id ?? option.label),
      value: rawOption,
      html: { ...html },
    };
  }

  // A primitive
  return {
    label: option ?? '',
    identity: String(option ?? ''),
    value: option,
    unselectable: false,
    disabled: false,
  };
}
