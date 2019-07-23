import { useCallback, useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';

export const useOptionisedProps = ({
  options: rawOptions, value: rawValue, blank, setValue: rawSetValue, ...props
}) => {
  const options = useMemo(
    () => (
      (blank
        ? [{ value: null, label: blank }, ...rawOptions]
        : rawOptions
      ).map(optionise)
    ),
    [rawOptions, blank],
  );

  const value = useMemo(
    () => optionise(rawValue),
    [rawValue],
  );

  const valueIndex = useMemo(
    () => options.findIndex(o => o.value === value.value),
    [value, options],
  );

  const setValue = useCallback(
    (option) => {
      let index = option !== null ? options.findIndex(o => o.value === option.value) : -1;
      if (blank && index > -1) {
        index -= 1;
      }
      rawSetValue(index > -1 ? rawOptions[index] : null);
    },
    [options, rawSetValue, rawOptions, blank],
  );

  return { blank, options, value, valueIndex, setValue, ...props };
};
