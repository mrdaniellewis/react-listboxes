import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from './select.jsx';

function SelectWrapper({ value: initialValue, ...props }) {
  const [value, setValue] = useState(initialValue);
  return (
    <Select value={value} setValue={setValue} {...props} />
  );
}

describe('options as array of strings', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders an select', () => {
    const { container } = render(
      <SelectWrapper options={options} data-foo="bar" />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders a select with a selected value', () => {
    const { container } = render(
      <SelectWrapper options={options} value="Orange" />,
    );
    const select = container.querySelector('select');
    expect(select).toHaveValue('2');
    expect(select.querySelector('option:nth-child(3)')).toHaveTextContent('Orange');
  });

  it('triggers the setValue callback with the selected value', () => {
    const spy = jest.fn();
    const { container } = render(<SelectWrapper options={options} setValue={spy} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
    expect(spy).toHaveBeenCalledWith('Banana');
  });

  it('updates when the value changes', () => {
    const { container } = render(<SelectWrapper options={options} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
    expect(select).toHaveValue('1');
    expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('Banana');
  });

  describe('blank', () => {
    it('renders a blank option', () => {
      const { container } = render(<SelectWrapper options={options} blank="Please select…" />);
      const select = container.querySelector('select');
      expect(select.querySelector('option')).toHaveTextContent('Please select…');
      expect(select).toHaveValue('0');
    });

    it('renders with a selected value', () => {
      const { container } = render(<SelectWrapper options={options} blank="Please select…" value="Orange" />);
      const select = container.querySelector('select');
      expect(select).toHaveValue('3');
      expect(select.querySelector('option:nth-child(4)')).toHaveTextContent('Orange');
    });
  });
});

describe('options as array of numbers', () => {
  const options = [1, 2, 3];

  it('renders an select', () => {
    const { container } = render(
      <SelectWrapper options={options} />,
    );
    expect(container).toMatchSnapshot();
  });

  it('triggers the setValue callback with the selected value', () => {
    const spy = jest.fn();
    const { container } = render(<SelectWrapper options={options} setValue={spy} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
    expect(spy).toHaveBeenCalledWith(2);
  });

  it('updates when the value changes', () => {
    const { container } = render(<SelectWrapper options={options} />);
    const select = container.querySelector('select');
    fireEvent.change(select, { target: { value: '1' } });
    expect(select).toHaveValue('1');
    expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('2');
  });
});

describe('options as objects', () => {
  describe('with a label key', () => {
    const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

    it('renders an select', () => {
      const { container } = render(
        <SelectWrapper options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('triggers the setValue callback with the selected value', () => {
      const spy = jest.fn();
      const { container } = render(<SelectWrapper options={options} setValue={spy} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
    });

    it('updates when the value changes', () => {
      const { container } = render(<SelectWrapper options={options} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('1');
      expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('Banana');
    });
  });

  describe('identity', () => {
    it('selects with first option with identical labels', () => {
      const options = [{ label: 'foo' }, { label: 'foo' }];
      const { container } = render(<SelectWrapper options={options} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('0');
    });

    it('uses id to set the identity', () => {
      const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }];
      const { container } = render(<SelectWrapper options={options} />);
      expect(container).toMatchSnapshot();
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('1');
    });

    it('uses value to set the identity', () => {
      const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }];
      const { container } = render(<SelectWrapper options={options} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('1');
    });
  });

  describe('grouped options', () => {
    describe('group as a string', () => {
      it.todo('renders the grouped options');
      it.todo('allows an option to be selected');
      it.todo('allows an option to be pre-selected');
    });

    describe('group as an object', () => {
      it.todo('renders the grouped options');
      it.todo('allows an option to be selected');
      it.todo('allows an option to be pre-selected');
    });
  });
});
