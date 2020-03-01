import React from 'react';
import { render } from '@testing-library/react';
import { TokenHighlight } from './token_highlight.jsx';
import { Context } from '../../context.js';

function TestHighlight({ children, ...props }) {
  return (
    <Context.Provider value={props}>
      <TokenHighlight>
        {children}
      </TokenHighlight>
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
      foo foobar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo foobar</div>');
});

it('highlights all tokens', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      foo bar foo bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>foo <mark>bar</mark> foo <mark>bar</mark></div>');
});

it('highlights the start of tokens', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      &quot;barfoo&quot;
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>"<mark>bar</mark>foo"');
});
