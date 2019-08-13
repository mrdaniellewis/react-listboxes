export function renderGroupedOptions({ options, renderGroup, renderOption }) {
  const groupChildren = new Map();
  return options.reduce((accumulator, option) => {
    if (option.group) {
      if (!groupChildren.has(option.group.identity)) {
        const children = [];
        groupChildren.set(option.group.identity, children);
        accumulator.push(renderGroup({ ...option, children }));
      }
      groupChildren.get(option.group.identity).push(renderOption(option));
    } else {
      accumulator.push(renderOption(option));
    }
    return accumulator;
  }, []);
}
