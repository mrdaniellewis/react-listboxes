import React, { useState } from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import { DropDown } from './drop_down.jsx';

function DropDownWrapper({ value: initialValue, ...props }) {
  const [value, setValue] = useState(initialValue);
  return (
    <DropDown id="id" value={value} setValue={setValue} {...props} />
  );
}

describe('options', () => {
  describe('as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed drop down', () => {
      const { container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
    });

    it('renders a drop down with a selected value', () => {
      const { container } = render(<DropDownWrapper options={options} value="Orange" />);
      const button = container.querySelector('button');
      expect(button).toHaveTextContent('Orange');
    });

    describe('expanding the list box', () => {
      it('opens the drop down on click with the first option selected', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });

      it('opens the drop down on click with the value selected', () => {
        const { container } = render(<DropDownWrapper options={options} value="Orange" />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(3)'));
      });

      it('opens the drop down with the down arrow', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.keyDown(button, { key: 'ArrowDown' });
        expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });

      it('opens the drop down with the up arrow', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.keyDown(button, { key: 'ArrowUp' });
        expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });
    });

    describe('navigating options', () => {
      it('moves to the next option with the down arrow', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
      });

      it('moves to the first option from the last option with the down arrow', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });

      it('moves to the previous option with the up arrow', () => {
        const { container } = render(<DropDownWrapper options={options} value="Banana" />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });

      it('moves to the last option from the first option with the up arrow', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(3)'));
      });

      it('moves to the first option with the home key', () => {
        const { container } = render(<DropDownWrapper options={options} value="Banana" />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'Home' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]'));
      });

      it('moves to the last option with the end key', () => {
        const { container } = render(<DropDownWrapper options={options} value="Banana" />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'End' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(3)'));
      });

      it.todo('moves the option when typing');
      it.todo('moves the option when typing multiple letters');
      it.todo('clears typing after a short delay');
    });

    describe('selecting an option', () => {
      describe('when clicking on an option', () => {
        describe('when the value is not the current value', () => {
          it('calls setValue', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.click(container.querySelector('[role=option]:nth-child(2)'));
            expect(spy).toHaveBeenCalledWith('Banana');
          });

          it('closes the list box and selects the button', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.click(container.querySelector('[role=option]:nth-child(2)'));
            expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            expect(document.activeElement).toEqual(button);
          });

          it('updates the displayed value', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.click(container.querySelector('[role=option]:nth-child(2)'));
            expect(button).toHaveTextContent('Banana');
          });
        });

        describe('when the value is the current value', () => {
          it('closes the listbox without calling setValue', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} value="Banana" setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.click(container.querySelector('[role=option]:nth-child(2)'));
            expect(spy).not.toHaveBeenCalled();
            expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            expect(document.activeElement).toEqual(button);
          });
        });
      });

      describe('when pressing enter on an option', () => {
        describe('when the value is not the current value', () => {
          it('calls setValue', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).toHaveBeenCalledWith('Banana');
          });

          it('closes the list box and selects the button', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            expect(document.activeElement).toEqual(button);
          });

          it('updates the displayed value', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(button).toHaveTextContent('Banana');
          });
        });

        describe('when the value is the current value', () => {
          it('closes the listbox without calling setValue', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} value="Banana" setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            expect(document.activeElement).toEqual(button);
          });
        });
      });

      describe('when blurring the listbox', () => {
        describe('when the value has changed', () => {
          it('calls setValue', async () => {
            const spy = jest.fn();
            const { container } = render((
              <>
                <DropDownWrapper options={options} setValue={spy} />
                <input />
              </>
            ));
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            container.querySelector('input').focus();
            await wait(() => {
              expect(spy).toHaveBeenCalledWith('Banana');
            });
          });

          it('closes the list box without removing the focus', async () => {
            const { container } = render((
              <>
                <DropDownWrapper options={options} />
                <input />
              </>
            ));
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            const input = container.querySelector('input');
            input.focus();
            await wait(() => {
              expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            });
            expect(document.activeElement).toEqual(input);
          });

          it('updates the displayed value', async () => {
            const { container } = render((
              <>
                <DropDownWrapper options={options} />
                <input />
              </>
            ));
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            const input = container.querySelector('input');
            input.focus();
            await wait(() => {
              expect(button).toHaveTextContent('Banana');
            });
          });
        });

        describe('when the value has not changed', () => {
          it('closes the listbox without calling setValue', async () => {
            const spy = jest.fn();
            const { container } = render((
              <>
                <DropDownWrapper options={options} value="Banana" setValue={spy} />
                <input />
              </>
            ));
            const button = container.querySelector('button');
            fireEvent.click(button);
            const input = container.querySelector('input');
            input.focus();
            await wait(() => {
              expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
            });
            expect(spy).not.toHaveBeenCalled();
            expect(document.activeElement).toEqual(input);
          });
        });
      });
    });
  });

  describe('options as array of numbers', () => {
    const options = [1, 2, 3];

    it('renders a closed drop down', () => {
      const { container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
    });

    it('triggers the setValue callback with the selected value', () => {
      const spy = jest.fn();
      const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
      const button = container.querySelector('button');
      fireEvent.click(button);
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(2);
      expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
      expect(document.activeElement).toEqual(button);
    });
  });

  describe.skip('options as array of objects', () => {
    describe('label', () => {
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

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} value={2} setValue={spy} />);
        const select = container.querySelector('select');
        expect(select).toHaveValue('1');
        fireEvent.change(select, { target: { value: '2' } });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} value={2} setValue={spy} />);
        const select = container.querySelector('select');
        expect(select).toHaveValue('1');
        fireEvent.change(select, { target: { value: '2' } });
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

      it('triggers the setValue callback with the selected value', () => {
        const spy = jest.fn();
        const { container } = render(<SelectWrapper options={options} setValue={spy} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: '3' } });
        expect(spy).toHaveBeenCalledWith({ label: 'Lemon', group: 'Citrus' });
      });

      it('updates when the value changes', () => {
        const { container } = render(<SelectWrapper options={options} />);
        const select = container.querySelector('select');
        fireEvent.change(select, { target: { value: '3' } });
        expect(select).toHaveValue('3');
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

  describe.skip('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { container } = render(<SelectWrapper
        options={options}
        setValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      const select = container.querySelector('select');
      fireEvent.change(select, { target: { value: '2' } });
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { container } = render(<SelectWrapper
        options={options}
        value={{ name: 'Banana' }}
        mapOption={({ name }) => ({ label: name })}
      />);
      const select = container.querySelector('select');
      expect(select).toHaveValue('1');
      fireEvent.change(select, { target: { value: '2' } });
      expect(select.querySelector('option:nth-child(2)')).toHaveTextContent('Banana');
    });
  });
});

describe.skip('blank', () => {
  const options = ['Apple', 'Banana', 'Orange'];

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

describe.skip('OptionComponent', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to all options', () => {
    const { container } = render(
      <SelectWrapper options={options} OptionComponent={{ 'data-foo': 'bar' }} />,
    );
    container.querySelectorAll('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('allows the option component to be replaced', () => {
    function TestOption({ props }) {
      return (
        <option
          data-foo="bar"
          {...props}
        />
      );
    }
    const { container } = render(
      <SelectWrapper options={options} OptionComponent={TestOption} />,
    );
    container.querySelectorAll('option').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe.skip('OptGroupComponent', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Orange', group: 'Citrus' },
    { label: 'Lemon', group: 'Citrus' },
    { label: 'Raspberry', group: 'Berry' },
    { label: 'Strawberry', group: 'Berry' },
  ];

  it('allows additional props to be added to all optgroups', () => {
    const { container } = render(
      <SelectWrapper options={options} OptGroupComponent={{ 'data-foo': 'bar' }} />,
    );
    container.querySelectorAll('optgroup').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });

  it('allows the optgroup component to be replaced', () => {
    function TestOptGroup({ props }) {
      return (
        <optgroup
          data-foo="bar"
          {...props}
        />
      );
    }
    const { container } = render(
      <SelectWrapper options={options} OptGroupComponent={TestOptGroup} />,
    );
    container.querySelectorAll('optgroup').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe.skip('SelectComponent', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('allows additional props to be added to the select', () => {
    const { container } = render(
      <SelectWrapper options={options} SelectComponent={{ 'data-foo': 'bar' }} />,
    );
    expect(container.querySelector('select')).toHaveAttribute('data-foo', 'bar');
  });

  it('allows the option component to be replaced', () => {
    function TestSelect({ props }) {
      return (
        <datalist
          data-foo="bar"
          {...props}
        />
      );
    }
    const { container } = render(
      <SelectWrapper options={options} OptGroupComponent={TestSelect} />,
    );
    container.querySelectorAll('optgroup').forEach((option) => {
      expect(option).toHaveAttribute('data-foo', 'bar');
    });
  });
});

describe.skip('additional props', () => {
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
