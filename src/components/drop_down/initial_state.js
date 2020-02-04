export function initialState({ value }) {
  return {
    expanded: false,
    listClassName: null,
    listStyle: null,
    search: '',
    selectedOption: value,
  };
}
