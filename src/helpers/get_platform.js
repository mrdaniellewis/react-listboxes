export function getPlatform() {
  if (/mac/i.test(navigator.platform)) {
    return 'mac';
  }
  return 'windows';
}
