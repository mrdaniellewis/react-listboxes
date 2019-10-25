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
  it.todo('renders an select');
  it.todo('allows an option to be selected');
  it.todo('allows an option to be pre-selected');

  describe('blank', () => {
    it.todo('renders a blank option');
    it.todo('allows the blank option to be selected');
    it.todo('allows an option to be selected');
    it.todo('allows an option to be pre-selected');
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
