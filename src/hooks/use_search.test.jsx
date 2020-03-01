import React, { useEffect } from 'react';
import { render, act } from '@testing-library/react';
import { useSearch } from './use_search.js';

function TestTokenSearch({ fn, initialOptions, debounce, onUpdate, minLength }) {
  const [filteredOptions, onSearch, busy] = useSearch(fn, { initialOptions, debounce, minLength });
  useEffect(() => {
    onUpdate(filteredOptions, onSearch, busy);
  }, [filteredOptions, onSearch, busy, onUpdate]);
  return null;
}

describe('options', () => {
  it('displays empty options by default', () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    expect(spy).toHaveBeenCalledWith(
      [],
      expect.any(Function),
      expect.anything(),
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it('finds options', async () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('ba');
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.any(Function),
      expect.anything(),
    );
    expect(fn).toHaveBeenCalledWith('ba');
  });

  it('finds options if searching for an empty string', async () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('');
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.any(Function),
      expect.anything(),
    );
    expect(fn).toHaveBeenCalledWith('');
  });

  it('does not change the search results if null is returned', async () => {
    const spy = jest.fn();
    const fn = jest
      .fn()
      .mockImplementationOnce(() => ['foo'])
      .mockImplementationOnce(() => null);

    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('ba');
      await Promise.resolve();
      spy.mock.calls[0][1]('ba');
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.any(Function),
      null,
    );
  });

  it('filters out out-of-sync returns', async () => {
    const spy = jest.fn();
    let resolve1;
    const promise1 = new Promise((resolve) => {
      resolve1 = resolve;
    });
    let resolve2;
    const promise2 = new Promise((resolve) => {
      resolve2 = resolve;
    });

    const fn = jest
      .fn()
      .mockImplementationOnce(() => promise1)
      .mockImplementationOnce(() => promise2);

    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
      spy.mock.calls[0][1]('b');
      resolve2(['foo']);
      await Promise.resolve();
      resolve1(['bar']);
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.any(Function),
      expect.anything(),
    );
  });
});

describe('busy', () => {
  it('is false initially', () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      false,
    );
  });

  it('is true while a search is running', async () => {
    const spy = jest.fn();
    const fn = jest.fn(() => new Promise(() => {}));
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
    });
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );
  });

  it('is false when a search is finished', async () => {
    const spy = jest.fn();
    let resolve;
    const fn = jest.fn(() => new Promise((r) => {
      resolve = r;
    }));
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
    });
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );
    await act(async () => {
      resolve(['foo']);
    });
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.anything(),
      false,
    );
  });

  it('is null when a search is finished and returns null', async () => {
    const spy = jest.fn();
    let resolve;
    const fn = jest.fn(() => new Promise((r) => {
      resolve = r;
    }));
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
    });
    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );
    await act(async () => {
      resolve(null);
    });
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      null,
    );
  });

  it('is not set to false by an out-of-sync return', async () => {
    const spy = jest.fn();
    let resolve;
    const promise = new Promise((r) => {
      resolve = r;
    });
    const fn = jest
      .fn()
      .mockImplementationOnce(() => promise)
      .mockImplementationOnce(() => new Promise(() => {}));

    render((
      <TestTokenSearch fn={fn} onUpdate={spy} />
    ));

    await act(async () => {
      spy.mock.calls[0][1]('a');
      spy.mock.calls[0][1]('b');
    });

    expect(spy).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      true,
    );

    spy.mockClear();

    await act(async () => {
      resolve(['foo']);
    });

    expect(spy).not.toHaveBeenCalled();
  });
});

describe('minLength', () => {
  it('does not run a search under minLength', async () => {
    const spy = jest.fn();
    const fn = jest.fn();
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
    });
    expect(fn).not.toHaveBeenCalled();
  });

  it('sets busy to null under minLength', async () => {
    const spy = jest.fn();
    const fn = jest.fn();
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('a');
    });
    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      null,
    );
  });

  it('runs a search at minLength', async () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch fn={fn} onUpdate={spy} minLength={2} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('ab');
    });
    expect(fn).toHaveBeenCalledWith('ab');
    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.anything(),
      false,
    );
  });
});

describe('initialOptions', () => {
  it('displays all options by default', () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch initialOptions={['foo', 'bar', 'foe']} fn={fn} onUpdate={spy} />
    ));
    expect(spy).toHaveBeenCalledWith(
      ['foo', 'bar', 'foe'],
      expect.any(Function),
      false,
    );
    expect(fn).not.toHaveBeenCalled();
  });

  it('shows initial options if searching for nothing', async () => {
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);
    render((
      <TestTokenSearch initialOptions={['foo', 'bar', 'foe']} fn={fn} onUpdate={spy} />
    ));
    await act(async () => {
      spy.mock.calls[0][1]('');
    });
    expect(fn).not.toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      ['foo', 'bar', 'foe'],
      expect.any(Function),
      false,
    );
    expect(fn).not.toHaveBeenCalled();
  });
});

describe('debounce', () => {
  it('debounces starting a search', async () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);

    render((
      <TestTokenSearch fn={fn} onUpdate={spy} debounce={200} />
    ));

    await act(async () => {
      spy.mock.calls[0][1]('a');
      await Promise.resolve();
      spy.mock.calls[0][1]('b');
    });

    expect(fn).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(199);
    });

    expect(fn).not.toHaveBeenCalled();

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    expect(fn).toHaveBeenCalledWith('b');

    expect(spy).toHaveBeenLastCalledWith(
      ['foo'],
      expect.any(Function),
      false,
    );
  });

  it('sets busy to null while debouncing', async () => {
    jest.useFakeTimers();
    const spy = jest.fn();
    const fn = jest.fn(() => ['foo']);

    render((
      <TestTokenSearch fn={fn} onUpdate={spy} debounce={200} />
    ));

    await act(async () => {
      spy.mock.calls[0][1]('a');
      await Promise.resolve();
      spy.mock.calls[0][1]('b');
    });

    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      null,
    );

    await act(async () => {
      jest.advanceTimersByTime(200);
    });

    expect(spy).toHaveBeenLastCalledWith(
      expect.anything(),
      expect.anything(),
      false,
    );
  });
});
