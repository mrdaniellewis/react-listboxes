export function emHighlighter(term) {
  if (!term) {
    return [''];
  }
  // Elastic search will provide the highlight as "<em>foo</em>bar"
  let inHighlight = false;
  return term.split(/(<\/?em>)/).reduce((collection, part) => {
    if (!part) {
      // Do nothing
    } else if (part === '<em>') {
      inHighlight = true;
    } else if (part === '</em>') {
      inHighlight = false;
    } else if (inHighlight) {
      collection.push([part]);
    } else {
      collection.push(part);
    }
    return collection;
  }, []);
}
