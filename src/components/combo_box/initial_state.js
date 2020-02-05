export function initialState({ value }) {
  return {
    inlineAutoComplete: false,
    expanded: false,
    focusListBox: false,
    listClassName: null,
    listStyle: null,
    search: '',
    selectedOption: value,
  };
}
