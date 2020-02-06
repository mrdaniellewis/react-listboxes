export function initialState({ selectedOption }) {
  return {
    inlineAutoComplete: false,
    expanded: false,
    focusListBox: false,
    listClassName: null,
    listStyle: null,
    search: '',
    focusedOption: selectedOption,
  };
}
