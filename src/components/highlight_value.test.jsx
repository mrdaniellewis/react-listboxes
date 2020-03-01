import React from 'react';
import { render } from '@testing-library/react';
import { HighlightValue } from './highlight_value.jsx';
import { Context } from '../context.js';

it('calls highlight', () => {
  const spy = jest.fn(() => []);

  render((
    <Context.Provider value={{ state: { search: 'foo' }, test: 'bar' }}>
      <HighlightValue highlight={spy}>
        foo
      </HighlightValue>
    </Context.Provider>
  ));

  expect(spy).toHaveBeenCalledWith('foo', 'foo', { state: { search: 'foo' }, test: 'bar' });
});
