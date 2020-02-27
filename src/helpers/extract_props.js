export function extractProps(object, ...names) {
  const props = {};
  Object.keys(object).forEach((name) => {
    if (name !== undefined && (name.startsWith('data-') || names.includes(name))) {
      props[name] = object[name];
    }
  });
  return props;
}
