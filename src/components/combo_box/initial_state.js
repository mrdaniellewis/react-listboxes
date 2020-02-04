export function initialState({ value }) {
  return {
    inlineAutoComplete: false,
    expanded: false,
    focusedIndex: null,
    focusedIdentity: undefined,
    focusListBox: false,
    listClassName: null,
    listStyle: null,
    search: '',
    value,
  };
}
