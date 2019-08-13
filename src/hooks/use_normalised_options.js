/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { optioniseGroup } from '../helpers/optionise_group.js';
import { blankKey } from '../constants/blank_key.js';
import { uniqueIdGenerator } from '../helpers/unique_id_generator.js';

/**
 * Turn options into a regular structure
 *
 * Options can be supplied as:
 *
 *  - String[]
 *  - Number[]
 *  - [*, String|Number][]
 *  - { label: String|Number, value: *, id: String, group: String|Object, disabled: Boolean, options: [] }
 *
 *  If the option has a group property, it will be grouped into that group
 *  If the option has a options property it is a group
 */
export function useNormalisedOptions({ id, options, blank, value, ...props }) {
  const normalisedValue = useMemo(() => (
    value != null || blank ? optionise(value) : null
  ), [value, blank]);

  const normalisedOptions = useMemo(() => {
    const uniqueId = uniqueIdGenerator();
    const groups = new Map();
    let normalised = [];

    // Add a blank option
    if (blank) {
      normalised.push({ label: blank, identity: blankKey, value: null });
    }

    const normaliseOption = (rawOption) => {
      const option = optionise(rawOption);
      option.selected = option.identity === normalisedValue?.identity;
      return option;
    };

    // Group options
    options.forEach((option) => {
      if (Array.isArray(option?.options)) {
        // Option is a group
        const group = optioniseGroup(option);
        if (!groups.has(group.identity)) {
          groups.set(group.identity, group);
          normalised.push(group);
        }
        group.options = group.options.map(o => ({ ...normaliseOption(o), group }));
      } else if (option?.group) {
        // Options should be sorted into a group
        const group = optioniseGroup(option.group);
        if (!groups.has(group.identity)) {
          groups.set(group.identity, group);
          normalised.push(group);
        }
        groups.get(group.identity).options.push({ ...normaliseOption(option), group });
      } else {
        normalised.push(normaliseOption(option));
      }
    });

    // Flatten the options
    normalised = [].concat(...normalised.map(option => option.options || option));

    // Add keys
    normalised.forEach((option, index) => {
      option.key = uniqueId(option.html?.id || `${id}_${index}`);
      option.index = index;
    });

    return normalised;
  }, [id, options, blank, normalisedValue]);

  return {
    id,
    blank,
    options: normalisedOptions,
    value: normalisedValue,
    ...props,
  };
}
