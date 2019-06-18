export function nextInList(options, index, startIndex = index) {
  let i = index + 1;
  if (i >= options.length) {
    i = 0;
  }
  // Prevent infinite loops
  if (i === startIndex) {
    return null;
  }
  if (options[i] && options[i].disabled) {
    return nextInList(options, i, startIndex);
  }
  return options[i];
}
