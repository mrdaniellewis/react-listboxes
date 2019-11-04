import '@testing-library/jest-dom/extend-expect.js';

afterEach(() => {
  jest.restoreAllMocks();
  jest.useRealTimers();
});
