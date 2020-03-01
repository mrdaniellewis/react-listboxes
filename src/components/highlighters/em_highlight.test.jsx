import React from 'react';
import { render } from '@testing-library/react';
import { EmHighlight } from './em_highlight.jsx';
import { Context } from '../../context.js';

function TestHighlight({ children, ...props }) {
  return (
    <Context.Provider value={props}>
      <EmHighlight>
        {children}
      </EmHighlight>
    </Context.Provider>
  );
}

it('does not highlight with no children', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }} />
  ));

  expect(container).toContainHTML('<div></div>');
});

it('does not highlight with no search children', () => {
  const { container } = render((
    <TestHighlight state={{ search: null }}>
      foo
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('converts <em> in html strings to a highlight', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      {'foo <em>bar</em> <em>foe</em>'}
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> <mark>foe</mark></div>');
});
