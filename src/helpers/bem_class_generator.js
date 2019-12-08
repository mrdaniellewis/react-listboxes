export function bemClassGenerator(block) {
  return (element, ...modifiers) => {
    const base = element ? `${block}__${element}` : block;

    return [
      base,
      ...modifiers.filter(Boolean).map((m) => `${block}--${m}`),
    ].join(' ');
  };
}
