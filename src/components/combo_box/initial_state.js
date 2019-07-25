export function initialState({ value }) {
  return {
    expanded: false,
    search: '',
    listBoxFocused: false,
    selectedValue: value,
  };
}
