import { useMemo } from 'react';

export const useGrouped = options => (
  useMemo(
    () => {
      let lastGroup = null;
      return options.reduce((array, { group, ...values }, index) => {
        if (group !== lastGroup) {
          array.unshift({ name: group, children: [] });
          lastGroup = group;
        }
        array[0].children.push({ ...values, index });
        return array;
      }, []).reverse();
    },
    [options],
  )
);
