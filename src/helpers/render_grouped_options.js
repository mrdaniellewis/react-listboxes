export function renderGroupedOptions({ options, renderGroup, renderOption }) {
  const groupChildren = new Map();
  return options.reduce((accumulator, option, index) => {
    if (option.options) {
      const children = [];
      groupChildren.set(option.identity, children);
      accumulator.push(renderGroup({ ...option, children, index }));
    } else if (option.group) {
      groupChildren.get(option.group.identity).push(renderOption({ ...option, index }));
    } else {
      accumulator.push(renderOption({ ...option, index }));
    }
    return accumulator;
  }, []);
}
