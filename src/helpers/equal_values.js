export function equalValues(value1, value2) {
  return value1 === value2
    || (value1 && value2 && value1.value === value2.value);
}
