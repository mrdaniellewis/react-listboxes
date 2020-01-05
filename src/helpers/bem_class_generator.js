export function bemClassGenerator(block) {
  if (!block) {
    return () => null;
  }
  return (element, ...modifiers) => {
    const base = element ? `${block}__${element}` : block;

    return [
      base,
      ...modifiers.filter(Boolean).map((m) => `${base}--${m}`),
    ].join(' ');
  };
}
