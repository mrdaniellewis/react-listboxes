export function nextInList(options, index = -1, allowEmpty = false, startIndex = index) {
  let i = index + 1;
  if (i >= options.length) {
    if (allowEmpty) {
      return null;
    }
    i = 0;
  }
  // Prevent infinite loops
  if (i === startIndex) {
    return null;
  }
  if (options[i] && options[i].disabled) {
    return nextInList(options, i, allowEmpty, startIndex);
  }
  return options[i];
}
