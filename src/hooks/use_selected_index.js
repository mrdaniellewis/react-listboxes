import { useMemo } from 'react';
import { findSelectedIndex } from '../helpers/find_selected_index.js';

export function useSelectedIndex({ options, value, mustHaveSelection }) {
  return useMemo(
    () => findSelectedIndex({ options, value, mustHaveSelection }),
    [options, value, mustHaveSelection],
  );
}
