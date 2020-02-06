export function initialState({ selectedOption }) {
  return {
    expanded: false,
    listClassName: null,
    listStyle: null,
    search: '',
    focusedOption: selectedOption,
  };
}
