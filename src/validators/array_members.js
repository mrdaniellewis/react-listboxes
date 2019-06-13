export function arrayMembers(members) {
  return (propValue, key, ...rest) => {
    if (members[key]) {
      const error = members[key](propValue, key, ...rest);
      if (error) {
        return new Error(error.message);
      }
    }
    return null;
  };
}
