/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { UniqueIdGenerator } from '../helpers/unique_id_generator.js';

/**
 * Turn value and options into objects
 *
 * Each option will have the following values:
 *   - label - label to display
 *   - value - the original value
 *   - identity
 *   - key
 *   - group - reference to a group is grouped
 *   - options - reference to the options if a group
 *   - selected
 *   - html
 */
export function useNormalisedOptions({
  id, options: rawOptions, blank, value: rawValue, mapOption, ...props
}, { mustHaveSelection = false } = {}) {
  const options = useMemo(() => {
    const idGenerator = new UniqueIdGenerator();
    const groups = new Map();
    const normalised = [];

    // Add a blank option
    if (blank) {
      normalised.push({
        label: blank,
        identity: '',
        value: null,
        key: idGenerator.uniqueId(`${id}_option_blank`),
      });
    }

    rawOptions
      .map((option) => optionise(option, mapOption))
      .forEach((option) => {
        if (option.group) {
          let group = groups.get(option.group);
          if (!group) {
            group = {
              label: option.group,
              identity: option.group,
              options: [option],
              key: idGenerator.uniqueId(`${id}_group_${option.group}`),
              unselectable: true,
            };
            groups.set(option.group, group);
            normalised.push(group);
          } else {
            group.options.push(option);
          }
          option.group = group;
        }
        option.key = idGenerator.uniqueId(option.html?.id || `${id}_option_${option.label}`);
        normalised.push(option);
      });

    return normalised;
  }, [id, rawOptions, blank, mapOption]);

  const value = useMemo(() => {
    let normalised = rawValue && optionise(rawValue, mapOption);
    normalised = normalised && options.find((o) => normalised.identity === o.identity);
    if (normalised || !mustHaveSelection) {
      return normalised;
    }
    return options.find((o) => !o.unselectable);
  }, [rawValue, mapOption, options, mustHaveSelection]);

  return {
    id,
    options,
    value,
    ...props,
  };
}
