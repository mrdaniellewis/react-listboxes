import { GROUP } from '../constants/group.js';

export function reGroup(options) {
  let currentGroup = { children: [] };
  const grouped = [currentGroup];

  options.forEach((option) => {
    if (option.value === GROUP) {
      currentGroup = { ...option, children: [] };
      grouped.push(currentGroup);
      return;
    }
    currentGroup.children.push(option);
  });

  return grouped.filter(({ children }) => children.length);
}
