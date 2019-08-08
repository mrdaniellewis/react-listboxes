import { useMemo } from 'react';

export function useGroupedOptions(options) {
  return useMemo(() => {
    const grouped = new Map();
    options.forEach((option) => {
      const key = option?.group?.key;
      if (!grouped.has(key)) {
        grouped.set(key, { ...option.group, options: [] });
      }
      grouped.get(key).options.push(option);
    });
    return [...grouped.values()];
  }, [options]);
}
