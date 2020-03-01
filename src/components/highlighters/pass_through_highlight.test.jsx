import React from 'react';
import { render } from '@testing-library/react';
import { PassThroughHighlight } from './pass_through_highlight.jsx';
import { Context } from '../../context.js';

function TestHighlight({ children, ...props }) {
  return (
    <Context.Provider value={props}>
      <PassThroughHighlight>
        {children}
      </PassThroughHighlight>
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

it('does not highlight a match', () => {
  const { container } = render((
    <TestHighlight state={{ search: 'bar' }}>
      bar
    </TestHighlight>
  ));

  expect(container).toContainHTML('<div>bar</div>');
});
