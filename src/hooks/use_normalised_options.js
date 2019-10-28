/* eslint-disable no-param-reassign */
import { useMemo } from 'react';
import { optionise } from '../helpers/optionise.js';
import { UniqueIdGenerator } from '../helpers/unique_id_generator.js';

/**
 * Turn value and options into objects
 *
 * Each option will have the following values:
 *   - label - label to display
 *   - node - al
 *   - key
 *   - identity
 *   - group - optional
 *   - selected
 *   - html
 */
export function useNormalisedOptions({
  options, blank, value, mapOption, ...props
}) {
  const normalisedValue = useMemo(
    () => optionise(value, mapOption),
    [value, mapOption],
  );

  const normalisedOptions = useMemo(() => {
    const idGenerator = new UniqueIdGenerator();
    const groups = new Map();
    const normalised = [];

    // Add a blank option
    if (blank) {
      normalised.push({
        label: blank,
        identity: null,
        value: null,
        key: idGenerator.uniqueId(blank),
      });
    }

    options
      .map((option) => optionise(option, mapOption))
      .forEach((option) => {
        option.selected = option.identity === normalisedValue?.identity;
        if (option.group) {
          let group = groups.get(option.group);
          if (!group) {
            group = {
              label: group,
              identity: group,
              options: [option],
              key: idGenerator.uniqueId(`group_${group}`),
            };
            groups.set(option.group, { label: group, options: [option] });
          } else {
            group.options.push(option);
          }
          option.group = group;
        }
        option.key = idGenerator.uniqueId(option.html?.id || option.label);
        normalised.push(option);
      });

    normalised.forEach((option, index) => {
      option.index = index;
    });

    return normalised;
  }, [options, blank, normalisedValue, mapOption]);

  return {
    blank,
    options: normalisedOptions,
    value: normalisedValue,
    ...props,
  };
}
