import React from 'react';
import { render } from '@testing-library/react';
import { SubstringHighlight } from './substring_highlight.jsx';
import { Context } from '../../context.js';

function TestHighlight({ children, ...props }) {
  return (
    <Context.Provider value={props}>
      <SubstringHighlight>
        {children}
      </SubstringHighlight>
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

it('does not highlight no match', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      foo
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo</div>');
});

it('highlights a substring', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> foo bar</div>');
});
