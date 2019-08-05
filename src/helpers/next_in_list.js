export function nextInList(options, index = -1, allowEmpty = false) {
  let i = index + 1;
  if (i >= options.length) {
    if (allowEmpty) {
      return null;
    }
    i = 0;
  }
  return options[i];
}
