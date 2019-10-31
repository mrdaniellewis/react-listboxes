export function classGenerator(block) {
  return (element, ...args) => {
    if (!block) {
      return null;
    }

    const base = `${block}__${element}`;

    return [
      base,
      ...args.filter(Boolean).map((c) => `${base}${c}`),
    ].join(' ');
  };
}
