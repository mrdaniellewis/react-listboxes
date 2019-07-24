export function previousInList(options, index = -1, allowEmpty = false, startIndex = index) {
  let i = index - 1;
  if (i === -1 && allowEmpty) {
    return -1;
  }
  if (i < 0) {
    i = options.length - 1;
  }
  // Prevent infinite loops
  if (i === startIndex) {
    return -1;
  }
  if (options[i] && options[i].disabled) {
    return previousInList(options, i, allowEmpty, startIndex);
  }
  return i;
}
