import '@testing-library/jest-dom/extend-expect.js';

beforeEach(() => {
  expect.hasAssertions();
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});

let errorSpy;
let warnSpy;

beforeEach(() => {
  errorSpy = jest.spyOn(console, 'error');
  warnSpy = jest.spyOn(console, 'warn');
});

afterEach(() => {
  expect(errorSpy).not.toHaveBeenCalled();
  errorSpy = null;

  expect(warnSpy).not.toHaveBeenCalled();
  warnSpy = null;
});
