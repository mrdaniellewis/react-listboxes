import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { optioniseGroup } from '../helpers/optionise_group.js';
import { blankKey } from '../constants/blank_key.js';

export function useNormalisedOptions({ id, options, blank, value, ...props }) {
  const normalisedValue = useMemo(() => (
    value != null || blank ? optionise(value) : null
  ), [value, blank]);

  const normalisedOptions = useMemo(() => {
    let newOptions = options.map(optionise);

    if (blank) {
      newOptions.unshift({ label: blank, key: blankKey });
    }

    // expand any groups
    newOptions = newOptions.reduce((array, option) => {
      if (Array.isArray(option?.options)) {
        array.push(...option.options.map(o => ({ ...optionise(o), group: option })));
      } else {
        array.push(option);
      }
      return array;
    }, []);

    newOptions = newOptions.map((o, index) => ({
      ...o,
      group: optioniseGroup(o.group),
      index,
      selected: o.key === normalisedValue?.key,
    }));

    return newOptions;
  }, [options, blank, normalisedValue]);

  return {
    id,
    blank,
    options: normalisedOptions,
    value: normalisedValue,
    ...props,
  };
}
