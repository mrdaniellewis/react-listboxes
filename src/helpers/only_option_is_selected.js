export function onlyOptionIsSelected(options, value) {
  return options.length === 1 && value && options[0].value === value.value;
}
