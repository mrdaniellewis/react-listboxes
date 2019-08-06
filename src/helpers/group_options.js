import { GROUP } from '../constants/group.js';

export function groupOptions(options) {
  const groups = new Map();

  options.forEach(({ group, ...value }) => {
    let items = groups.get(group);
    if (!items) {
      items = { label: group, children: [], value: GROUP };
      groups.set(group, items);
    }
    items.children.push(value);
  });

  return [...groups.values()].reduce((array, group) => {
    if (group.label) {
      array.push(group);
    }
    array.push(...group.children);
    return array;
  }, []);
}
