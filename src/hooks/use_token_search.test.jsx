import React, { useEffect } from 'react';
import { render, act, wait } from '@testing-library/react';
import { useTokenSearch } from './use_token_search.js';

function TestTokenSearch({ options, index, tokenise, onUpdate }) {
  const params = index || tokenise ? { index, tokenise } : undefined;
  const [filteredOptions, onSearch, busy] = useTokenSearch(options, params);
  useEffect(() => {
    onUpdate(filteredOptions, onSearch, busy);
  }, [filteredOptions, onSearch, busy, onUpdate]);
  return null;
}

describe('options', () => {
  describe('options as string', () => {
    it('displays all options by default', () => {
      const spy = jest.fn();
      render((
        <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
      ));
      expect(spy).toHaveBeenCalledWith(
        ['foo', 'bar', 'foe'],
        expect.any(Function),
        false,
      );
    });

    it('filters options by a token search', async () => {
      const spy = jest.fn();
      render((
        <TestTokenSearch options={['foo', 'bar', 'foe bar', 'fabar']} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await wait(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar', 'foe bar'],
          expect.any(Function),
          false,
        );
      });
    });

    it('returns all options for no query', async () => {
      const spy = jest.fn();
      render((
        <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await wait(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar'],
          expect.any(Function),
          false,
        );
      });
      act(() => {
        spy.mock.calls[0][1]('');
      });
      await wait(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['foo', 'bar', 'foe'],
          expect.any(Function),
          false,
        );
      });
    });
  });

  describe('options as objects', () => {
    it('filters option label by a token search', async () => {
      const spy = jest.fn();
      const options = [
        { label: 'foo', id: 1 },
        { label: 'bar', id: 2 },
      ];
      render((
        <TestTokenSearch options={options} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('ba');
      });
      await wait(() => {
        expect(spy).toHaveBeenLastCalledWith(
          [options[1]],
          expect.any(Function),
          false,
        );
      });
    });

    describe('with a custom index', () => {
      it('filters options with a token search', async () => {
        const spy = jest.fn();
        const options = [
          { text: 'foo', id: 1 },
          { text: 'bar', id: 2 },
        ];
        function index(option) {
          return option.text;
        }
        render((
          <TestTokenSearch options={options} index={index} onUpdate={spy} />
        ));
        act(() => {
          spy.mock.calls[0][1]('ba');
        });
        await wait(() => {
          expect(spy).toHaveBeenLastCalledWith(
            [options[1]],
            expect.any(Function),
            false,
          );
        });
      });
    });
  });

  describe('with a custom tokenise', () => {
    it('filters options with a token search', async () => {
      const spy = jest.fn();
      const options = ['foo', 'bar'];
      function tokenise(option) {
        return option.split('');
      }
      render((
        <TestTokenSearch options={options} tokenise={tokenise} onUpdate={spy} />
      ));
      act(() => {
        spy.mock.calls[0][1]('r');
      });
      await wait(() => {
        expect(spy).toHaveBeenLastCalledWith(
          ['bar'],
          expect.any(Function),
          false,
        );
      });
    });
  });
});

describe('busy', () => {
  it('is always false', async () => {
    const spy = jest.fn();
    render((
      <TestTokenSearch options={['foo', 'bar', 'foe']} onUpdate={spy} />
    ));
    act(() => {
      spy.mock.calls[0][1]('ba');
    });
    await wait(() => {
      expect(spy).toHaveBeenLastCalledWith(
        ['bar'],
        expect.any(Function),
        false,
      );
    });
    expect(spy).not.toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );
  });
});