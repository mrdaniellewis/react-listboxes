import { checkPropTypes } from 'prop-types';

export function arrayMembers(members) {
  return (items, index, name, _, prop) => {
    members.forEach((check, i) => {
      checkPropTypes(
        { [i]: check },
        items[index],
        i,
        `${name} ${prop}`,
      );
    });
  };
}
