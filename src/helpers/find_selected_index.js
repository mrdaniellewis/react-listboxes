export function findSelectedIndex({ options, selectedValue, required }) {
  let selectedIndex = -1;
  if (selectedValue) {
    selectedIndex = options.findIndex(o => o.identity === selectedValue.identity);
  }
  if (selectedIndex === -1 && required) {
    selectedIndex = 0;
  }
  return selectedIndex;
}
