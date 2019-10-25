import { passThroughHighlighter } from './pass_through_highlighter.js';

it('returns no highlight', () => {
  expect(passThroughHighlighter('foo')).toEqual(['foo']);
});
