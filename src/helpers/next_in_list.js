export function nextInList(options, index = -1, allowEmpty = false, startIndex = index) {
  let i = index + 1;
  if (i >= options.length) {
    if (allowEmpty) {
      return -1;
    }
    i = 0;
  }
  // Prevent infinite loops
  if (i === startIndex) {
    return -1;
  }
  if (options[i] && options[i].disabled) {
    return nextInList(options, i, allowEmpty, startIndex);
  }
  return i;
}
