import { useMemo } from 'react';

export function useSelectedIndex({ options, selectedValue }) {
  return useMemo(() => {
    let selectedIndex = -1;
    if (selectedValue) {
      selectedIndex = options.findIndex(o => o.identity === selectedValue.identity);
    }
    return selectedIndex;
  }, [options, selectedValue]);
}
