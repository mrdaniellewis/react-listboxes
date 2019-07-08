import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';

export const useOptionised = (options, blank) => (
  useMemo(
    () => (
      (blank
        ? [{ value: null, label: blank }, ...options]
        : options
      ).map(optionise)
    ),
    [options, blank],
  )
);
