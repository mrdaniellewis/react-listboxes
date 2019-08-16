import { useMemo } from 'react';
import { findSelectedIndex } from '../helpers/find_selected_index.js';

export function useSelectedIndex({ options, selectedValue, required }) {
  return useMemo(
    () => findSelectedIndex({ options, selectedValue, required }),
    [options, selectedValue, required],
  );
}
