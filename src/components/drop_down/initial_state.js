export function initialState({ value }) {
  return {
    expanded: false,
    search: '',
    selectedValue: value,
    mouseOver: false,
  };
}
