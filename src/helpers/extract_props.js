export function extractProps(object, ...names) {
  const props = {};
  let allData = false;
  let allAria = false;
  names.forEach((name) => {
    if (name === 'data-*') {
      allData = true;
    }
    if (name === 'aria-*') {
      allAria = true;
    }
    if (name in object) {
      props[name] = object[name];
    }
  });
  if (allData || allAria) {
    Object.keys(object).forEach((name) => {
      if ((allData && name.startsWith('data-')) || (allAria && name.startsWith('aria-'))) {
        props[name] = object[name];
      }
    });
  }
  return props;
}
