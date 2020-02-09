export function isShortcut(event, ...shortcuts) {
  return shortcuts.includes([
    event.getModifierState('Alt') ? 'Alt+' : '',
    event.getModifierState('Meta') ? 'Meta+' : '',
    event.getModifierState('Control') ? 'Control+' : '',
    event.key,
  ].join(''));
}
