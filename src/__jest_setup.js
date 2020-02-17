import '@testing-library/jest-dom/extend-expect.js';

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
  expect(errorSpy).not.toHaveBeenCalled(); // eslint-disable-line jest/no-standalone-expect
  errorSpy = null;

  expect(warnSpy).not.toHaveBeenCalled(); // eslint-disable-line jest/no-standalone-expect
  warnSpy = null;
});
