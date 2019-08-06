export function addEventOnce(target, event, fn, options) {
  const eventFn = () => {
    target.removeEventListener(event, eventFn, options);
    fn();
  };
  target.addEventListener(event, eventFn, options);

  return () => {
    target.removeEventListener(event, eventFn, options);
  };
}
