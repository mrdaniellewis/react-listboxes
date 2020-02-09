import { isMac } from './is_mac.js';

export function getKey(event) {
  const { key, ctrlKey, altKey, metaKey } = event;

  if (!isMac()) {
    return key;
  }

  const shortcut = [
    altKey ? 'Alt+' : '',
    ctrlKey ? 'Control+' : '',
    metaKey ? 'Meta+' : '',
    key,
  ].join('');

  if (shortcut === 'Ctrl+h') {
    return 'Backspace';
  }
  if (shortcut === 'Ctrl+d' || shortcut === 'Ctrl+k') {
    return 'Delete';
  }
  return key;
}
