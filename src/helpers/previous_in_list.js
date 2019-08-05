export function previousInList(options, index = -1, allowEmpty = false) {
  let i = index - 1;
  if (i === -1 && allowEmpty) {
    return null;
  }
  if (i < 0) {
    i = options.length - 1;
  }
  return options[i];
}
