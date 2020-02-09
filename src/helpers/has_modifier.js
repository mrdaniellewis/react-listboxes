export function hasModifier(event, ...keys) {
  return keys.some((key) => (
    event.getModifierState(key)
  ));
}
