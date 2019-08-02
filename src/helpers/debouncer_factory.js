/**
 * Debounce a callback
 * Delay running a callback in response to new input
 * @param {Number} options.delay delay to wait for new calls
 * @param {Number} [options.maxDelay] do not delay a callback running longer than this
 * @returns {Function}
 */
export function debouncerFactory({ delay = 0, maxDelay } = {}) {
  let timeout;
  let forceTimeout;
  let force = false;

  return (fn) => {
    if (maxDelay && !forceTimeout) {
      forceTimeout = setTimeout(() => {
        force = true;
      }, maxDelay);
    }

    const call = () => {
      force = false;
      clearTimeout(forceTimeout);
      forceTimeout = null;
      fn();
    };

    clearTimeout(timeout);

    if (force) {
      call();
      return;
    }

    timeout = setTimeout(call, delay);
  };
}
