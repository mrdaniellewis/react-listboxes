import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { optioniseGroup } from '../helpers/optionise_group.js';
import { blankKey } from '../constants/blank_key.js';
import { uniqueIdGenerator } from '../helpers/unique_id_generator.js';

export function useNormalisedOptions({ id, options, blank, value, ...props }) {
  const normalisedValue = useMemo(() => (
    value != null || blank ? optionise(value) : null
  ), [value, blank]);

  const normalisedOptions = useMemo(() => {
    const uniqueId = uniqueIdGenerator();
    const emptyGroup = { identity: undefined, options: [] };
    const groups = new Map([[undefined, emptyGroup]]);
    let index = 0;

    if (blank) {
      emptyGroup.options.unshift({ label: blank, identity: blankKey, value: null });
    }

    const mapOption = (option) => {
      const o = optionise(option);
      return {
        ...o,
        selected: option.identity === normalisedValue?.identity,
        key: uniqueId(option.id || `${id}_${index}`),
        index: index++, // eslint-disable-line no-plusplus
      };
    };

    options.forEach((option) => {
      const group = optioniseGroup(Array.isArray(option?.options) ? option : option?.group);
      if (!groups.has(group.identity)) {
        groups.set(group.identity, {
          ...group,
          key: uniqueId(option.id || `${id}_group_${group.label}`),
        });
      }
      if (!Array.isArray(option?.options)) {
        groups.get(group.identity).options.push(mapOption(option));
      } else {
        group.options = group.options.map(mapOption);
      }
    });

    return [...emptyGroup.options, ...[...groups.values()].slice(1).filter(o => o.options.length)];
  }, [id, options, blank, normalisedValue]);

  const flatOptions = useMemo(() => (
    normalisedOptions.reduce((array, option) => {
      array.push(option);
      if (Array.isArray(option.options)) {
        array.push(...option.options);
      }
      return array;
    }, [])
  ), [normalisedOptions]);

  return {
    id,
    blank,
    options: normalisedOptions,
    flatOptions,
    value: normalisedValue,
    ...props,
  };
}
