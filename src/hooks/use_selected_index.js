import { useMemo } from 'react';

export function useSelectedIndex({ options, selectedValue }) {
  return useMemo(() => {
    let selectedIndex = -1;
    if (selectedValue) {
      selectedIndex = options.findIndex(o => o.value === selectedValue.value);
    }
    return selectedIndex;
  }, [options, selectedValue]);
}
