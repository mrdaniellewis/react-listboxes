export function reGroup(options) {
  let currentGroup = { options: [] };
  const grouped = [currentGroup];

  options.forEach((option) => {
    if (Array.isArray(option.options)) {
      currentGroup = { ...option, options: [] };
      grouped.push(currentGroup);
      return;
    }
    currentGroup.options.push(option);
  });

  return grouped.filter(group => group.options.length);
}
