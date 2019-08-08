export function groupOptions(options) {
  const groups = new Map();

  options.forEach(({ group, ...value }) => {
    let items = groups.get(group);
    if (!items) {
      items = { label: group, options: [], identity: `__group_${group}` };
      groups.set(group, items);
    }
    items.options.push(value);
  });

  return [...groups.values()].reduce((array, group) => {
    if (group.label) {
      array.push(group);
    }
    array.push(...group.options);
    return array;
  }, []);
}
