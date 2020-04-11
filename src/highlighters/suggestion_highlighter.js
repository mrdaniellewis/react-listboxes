/**
 * Highlights the completion of a string
 *
 * The inverse of the prefixHighlighter
 *
 * suggestionHighlighter('foobarfoo', 'foo')
 * = ['foo', ['barfoo']]
 */
export function suggestionHighlighter(term, query) {
  if (!term || !query) {
    return [term || ''];
  }

  if (query && term.toLowerCase().startsWith(query.toLowerCase())) {
    return [term.slice(0, query.length), [term.slice(query.length)]].filter(Boolean);
  }

  return [term];
}
