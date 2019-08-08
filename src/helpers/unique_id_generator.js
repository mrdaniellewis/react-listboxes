export function uniqueIdGenerator() {
  const set = new Set();

  return (value) => {
    let unique = String(value).replace(/\s+/g, '_');
    while (set.has(unique)) {
      unique = unique.replace(/(?:_(\d+))?$/, (m, n = 0) => `_${+n + 1}`);
    }
    set.add(unique);
    return unique;
  };
}
