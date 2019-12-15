export function findSelectedIndex({ options, value, mustHaveSelection }) {
  let selectedIndex = -1;
  if (value) {
    selectedIndex = options.findIndex((o) => o.identity === value.identity);
  }
  if (selectedIndex === -1) {
    selectedIndex = mustHaveSelection ? 0 : null;
  }
  return selectedIndex;
}
