import { emHighlighter } from './em_highlighter.js';

it('returns an empty string with no term', () => {
  expect(emHighlighter('')).toEqual(['']);
});

it('returns the term if no highlight', () => {
  expect(emHighlighter('foo')).toEqual(['foo']);
});

it('returns the highlighted terms', () => {
  expect(emHighlighter('foo<em>bar</em>foe<em>thumb</em>fee')).toEqual(['foo', ['bar'], 'foe', ['thumb'], 'fee']);
});
