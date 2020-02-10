export function initialState({ selectedOption }) {
  return {
    ariaBusy: false,
    inlineAutoComplete: false,
    expanded: false,
    focusListBox: false,
    listClassName: null,
    listStyle: null,
    search: '',
    focusedOption: selectedOption,
  };
}
