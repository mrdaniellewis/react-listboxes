import React, { useState } from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Select } from './select.jsx';

function SelectWrapper({ value: initialValue, ...props }) {
  const [value, setValue] = useState(initialValue);
  return (
    <Select value={value} onValue={setValue} {...props} />
  );
}

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders an select', () => {
      const { container } = render(
        <SelectWrapper options={options} />,
      );
      expect(container).toMatchSnapshot();
    });

    it('renders a select with a selected value', () => {
      const { container } = render(
        <SelectWrapper options={options} value="Orange" />,
      );
      const select = container.querySelector('select');
      expect(select).toHaveValue('Orange');
      expect(select.querySelector('option:nth-child(3)')).toHaveTextContent('Orange');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { container } = render(<SelectWrapper options={options} onValue={spy} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith('Banana');
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { container } = render(<SelectWrapper options={options} onChange={spy} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: 'Banana' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ target: select }));
    });

    it('updates when the value changes', () => {
      const { container } = render(<SelectWrapper options={options} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: 'Apple' } });
      expect(select).toHaveValue('Apple');
      expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('Banana');
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

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { container } = render(<SelectWrapper options={options} onValue={spy} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(2);
    });

    it('triggers the onChange callback with the selected value', () => {
      const spy = jest.fn((e) => e.persist());
      const { container } = render(<SelectWrapper options={options} onChange={spy} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith(expect.objectContaining({ target: select }));
    });

    it('updates when the value changes', () => {
      const { container } = render(<SelectWrapper options={options} />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '1' } });
      expect(select).toHaveValue('1');
      expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('2');
    });
  });

  describe('options as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders an select', () => {
        const { container } = render(
          <SelectWrapper options={options} />,
        );
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', () => {
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} onValue={spy} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        const { container } = render(<SelectWrapper options={options} onChange={spy} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Banana' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ target: select }));
      });

      it('updates when the value changes', () => {
        const { container } = render(<SelectWrapper options={options} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Banana' } });
        expect(select).toHaveValue('Banana');
        expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('Banana');
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} value={2} onValue={spy} />);
        const select = container.querySelector('select');
        expect(select).toHaveValue('2');
        fireEvent.change(select, { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} value={2} onValue={spy} />);
        const select = container.querySelector('select');
        expect(select).toHaveValue('2');
        fireEvent.change(select, { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('disabled', () => {
      it('sets the disabled attribute', () => {
        const options = [{ label: 'foo', disabled: true }];
        const { container } = render(<SelectWrapper options={options} />);
        const option = container.querySelector('option');
        expect(option).toHaveAttribute('disabled', '');
      });
    });

    describe('html', () => {
      it('sets attributes on the element', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { container } = render(<SelectWrapper options={options} />);
        const option = container.querySelector('option');
        expect(option).toHaveAttribute('data-foo', 'bar');
        expect(option).toHaveAttribute('class', 'class');
      });
    });

    describe('group', () => {
      const options = [
        { label: 'Apple' },
        { label: 'Orange', group: 'Citrus' },
        { label: 'Lemon', group: 'Citrus' },
        { label: 'Raspberry', group: 'Berry' },
        { label: 'Strawberry', group: 'Berry' },
      ];

      it('renders grouped options', () => {
        const { container } = render(<SelectWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('triggers the onValue callback with the selected value', () => {
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} onValue={spy} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Lemon', group: 'Citrus' });
      });

      it('triggers the onChange callback with the selected value', () => {
        const spy = jest.fn((e) => e.persist());
        const { container } = render(<SelectWrapper options={options} onChange={spy} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Lemon' } });
        expect(spy).toHaveBeenCalledWith(expect.objectContaining({ target: select }));
      });

      it('updates when the value changes', () => {
        const { container } = render(<SelectWrapper options={options} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: 'Lemon' } });
        expect(select).toHaveValue('Lemon');
        expect(select.querySelector('optgroup:first-of-type > option:nth-child(2)')).toHaveTextContent('Lemon');
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { container } = render(<SelectWrapper options={options} />);
        const option = container.querySelector('option');
        expect(option).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { container } = render(<SelectWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: 'Orange' } });
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { container } = render(<SelectWrapper
        options={options}
        value={{ name: 'Banana' }}
        mapOption={({ name }) => ({ label: name })}
      />);
      const select = container.querySelector('select');
      expect(select).toHaveValue('Banana');
      fireEvent.change(select, { target: { value: 'Orange' } });
      expect(select).toHaveValue('Orange');
      expect(select.querySelector('option:nth-child(3)')).toHaveTextContent('Orange');
    });
  });
});

describe('blank', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a blank option', () => {
    const { container } = render(<SelectWrapper options={options} blank="Please select…" />);
    const select = container.querySelector('select');
    expect(select.querySelector('option')).toHaveTextContent('Please select…');
    expect(select).toHaveValue('');
  });

  it('renders with a selected value', () => {
    const { container } = render(<SelectWrapper options={options} blank="Please select…" value="Orange" />);
    const select = container.querySelector('select');
    expect(select).toHaveValue('Orange');
    expect(select.querySelector('option:nth-child(4)')).toHaveTextContent('Orange');
  });
});

describe('optionProps', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to all options', () => {
    const { container } = render(
      <SelectWrapper options={options} optionProps={{ 'data-foo': 'bar' }} />,
    );
    container.querySelectorAll('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe('optgroupProps', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Orange', group: 'Citrus' },
    { label: 'Lemon', group: 'Citrus' },
    { label: 'Raspberry', group: 'Berry' },
    { label: 'Strawberry', group: 'Berry' },
  ];

  it('allows additional props to be added to all options', () => {
    const { container } = render(
      <SelectWrapper options={options} optgroupProps={{ 'data-foo': 'bar' }} />,
    );
    container.querySelectorAll('optgroup').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('includes them on the select', () => {
    const { container } = render(
      <SelectWrapper options={options} required data-foo="bar" />,
    );
    const select = container.querySelector('select');
    expect(select).toHaveAttribute('required', '');
    expect(select).toHaveAttribute('data-foo', 'bar');
  });
});
