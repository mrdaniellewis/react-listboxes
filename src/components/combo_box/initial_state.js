export function initialState({ label = '' }) {
  return {
    expanded: false,
    search: '',
    label,
  };
}
