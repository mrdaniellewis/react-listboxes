import { useMemo } from 'react';

export function useGroupedOptions(options) {
  return useMemo(() => {
    const grouped = new Map();
    options.forEach((option) => {
      const identity = option?.group?.identity;
      if (!grouped.has(identity)) {
        grouped.set(identity, { ...option.group, options: [] });
      }
      grouped.get(identity).options.push(option);
    });
    return [...grouped.values()];
  }, [options]);
}
