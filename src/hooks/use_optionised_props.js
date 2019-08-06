import { useCallback, useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { groupOptions } from '../helpers/group_options.js';

export const useOptionisedProps = ({
  id, options: rawOptions, value: rawValue, blank, setValue: rawSetValue, ...props
}) => {
  const options = useMemo(
    () => {
      let newOptions = blank
        ? [{ value: null, label: blank, id: `${id}_blank` }, ...rawOptions]
        : rawOptions;
      newOptions = newOptions.map(o => optionise(o));
      newOptions = groupOptions(newOptions);
      newOptions = newOptions.map((o, i) => ({ id: `${id}_${i}`, ...o }));
      return newOptions;
    },
    [id, rawOptions, blank],
  );

  const value = useMemo(
    () => (rawValue != null || blank ? optionise(rawValue) : null),
    [rawValue, blank],
  );

  const valueIndex = useMemo(
    () => options.findIndex(o => o.value === (value && value.value)),
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

  return { id, blank, options, value, valueIndex, setValue, ...props };
};
