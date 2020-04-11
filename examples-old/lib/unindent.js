export function unindent(strings) {
  let spaces;
  return strings[0].replace(/^( +)(.*$)/mg, (m, s, line) => {
    if (spaces === undefined && line.trim()) {
      spaces = s.length;
    }
    return m.slice(spaces || 0);
  }).trim();
}
