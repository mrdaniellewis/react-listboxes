export function previousInList(options, index, startIndex = index) {
  let i = index - 1;
  if (i < 0) {
    i = options.length - 1;
  }
  // Prevent infinite loops
  if (i === startIndex) {
    return null;
  }
  if (options[i] && options[i].disabled) {
    return previousInList(options, i, startIndex);
  }
  return options[i];
}
