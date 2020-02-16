export function initialState({ selectedOption }) {
  return {
    inlineAutoComplete: false,
    expanded: false,
    focusListBox: false,
    search: null,
    focusedOption: selectedOption,
  };
}
