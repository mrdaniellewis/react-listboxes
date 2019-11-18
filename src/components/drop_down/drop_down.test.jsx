import React, { useState } from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import { DropDown } from './drop_down.jsx';

function DropDownWrapper({ value: initialValue, ...props }) {
  const [value, setValue] = useState(initialValue);
  return (
    <DropDown id="id" value={value} setValue={setValue} {...props} />
  );
}

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed drop down', () => {
        const { container, getByRole } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(getByRole('listbox', { hidden: true })).toHaveAttribute('hidden', '');
      });

      it('renders a drop down with a selected value', () => {
        const { getByRole } = render(<DropDownWrapper options={options} value="Orange" />);
        expect(getByRole('button')).toHaveTextContent('Orange');
      });

      describe('expanding the list box', () => {
        it('opens the drop down on click with the first option selected', () => {
          const { getAllByRole, getByRole } = render(<DropDownWrapper options={options} />);
          fireEvent.click(getByRole('button'));
          expect(getByRole('listbox')).not.toHaveAttribute('hidden');
          expect(document.activeElement).toEqual(getAllByRole('option')[0]);
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
        it.todo('sets aria-activedescendant');

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

        describe('typing', () => {
          it('moves the option when typing', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
          });

          it('moves the option when typing case-insensitively', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'B' });
            expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
          });

          it('does not moves the option if there is no match', () => {
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'z' });
            expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
          });

          it('moves the option when typing multiple letters', () => {
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            const { container } = render(<DropDownWrapper options={similarOptions} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
          });

          it('resets typing after a short delay', () => {
            jest.useFakeTimers();
            const { container } = render(<DropDownWrapper options={options} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            act(() => jest.advanceTimersByTime(1000));
            fireEvent.keyDown(document.activeElement, { key: 'o' });
            expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(3)'));
          });
        });
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
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
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
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
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
                expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
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

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        const option = container.querySelector('[role=option]:nth-child(2)');
        expect(option).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
      });

      it('selects a disabled option by typing', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'b' });
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.click(container.querySelector('[role=option]:nth-child(2)'));
            expect(spy).not.toHaveBeenCalled();
            expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
            const button = container.querySelector('button');
            fireEvent.click(button);
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
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

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { container } = render(
          <DropDownWrapper options={options} value={2} setValue={spy} />,
        );
        const button = container.querySelector('button');
        fireEvent.click(button);
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { container } = render(
          <DropDownWrapper options={options} value={2} setValue={spy} />,
        );
        const button = container.querySelector('button');
        fireEvent.click(button);
        expect(document.activeElement).toEqual(container.querySelector('[role=option]:nth-child(2)'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { container } = render(
          <DropDownWrapper options={options} />,
        );
        const option = container.querySelector('[role=option]');
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
        const { container } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('selects a group with the arrow keys', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toHaveTextContent('Citrus');
      });

      it('selects a group by typing', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'c' });
        expect(document.activeElement).toHaveTextContent('Citrus');
      });

      it('triggers setValue when an option is selected', () => {
        const spy = jest.fn();
        const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        const { container } = render(<DropDownWrapper options={options} />);
        const button = container.querySelector('button');
        fireEvent.click(button);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(button).toHaveTextContent('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { container, getByText } = render(
            <DropDownWrapper options={options} setValue={spy} />,
          );
          const button = container.querySelector('button');
          fireEvent.click(button);
          fireEvent.click(getByText('Citrus'));
          expect(spy).not.toHaveBeenCalled();
          expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        });
      });

      describe('when pressing enter on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { container } = render(<DropDownWrapper options={options} setValue={spy} />);
          const button = container.querySelector('button');
          fireEvent.click(button);
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Enter' });
          expect(spy).not.toHaveBeenCalled();
          expect(container.querySelector('[role=listbox]')).not.toHaveAttribute('hidden');
        });
      });

      describe('when bluring the listbox', () => {
        it('closes the listbox without selecting the group', async () => {
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

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { container } = render(<DropDownWrapper options={options} />);
        const option = container.querySelector('[role=option]');
        expect(option).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

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
      expect(spy).toHaveBeenCalledWith('Banana');
      expect(container.querySelector('[role=listbox]')).toHaveAttribute('hidden', '');
      expect(document.activeElement).toEqual(button);
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

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { container, getByText } = render(<DropDownWrapper
        options={options}
        setValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      const button = container.querySelector('button');
      fireEvent.click(button);
      fireEvent.click(getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { container, getByText } = render(<DropDownWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      const button = container.querySelector('button');
      fireEvent.click(button);
      fireEvent.click(getByText('Orange'));
      expect(button).toHaveTextContent('Orange');
    });
  });
});

describe('blank', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a blank option', () => {
    const { container } = render(<DropDownWrapper options={options} blank="Please select…" />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(document.querySelector('[role=option]')).toHaveTextContent('Please select…');
  });

  it('renders with a selected value', () => {
    const { container } = render(<DropDownWrapper options={options} blank="Please select…" value="Orange" />);
    const button = container.querySelector('button');
    fireEvent.click(button);
    expect(document.activeElement).toHaveTextContent('Orange');
  });

  it('allows a blank option to be selected', () => {
    const spy = jest.fn();
    const { container, getByText } = render(<DropDownWrapper
      options={options}
      blank="Please select…"
      value="Orange"
      setValue={spy}
    />);
    const button = container.querySelector('button');
    button.click();
    fireEvent.click(getByText('Please select…'));
    expect(spy).toHaveBeenCalledWith(null);
  });
});

describe('children', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders children in the button', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} blank="Please select…">
        Custom text
      </DropDownWrapper>,
    );
    expect(getByRole('button')).toHaveTextContent('Custom text');
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('does not set the focus to options', () => {
    const { getByRole, getAllByRole } = render(
      <DropDownWrapper options={options} managedFocus={false} />,
    );
    fireEvent.click(getByRole('button'));
    const listBox = getByRole('listbox');
    expect(document.activeElement).toEqual(listBox);
    fireEvent.keyDown(listBox, { key: 'ArrowDown' });
    expect(document.activeElement).toEqual(listBox);
    expect(listBox).toHaveAttribute('aria-activedescendant', getAllByRole('option')[1].id);
  });

  it('allows an option to be selected', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} managedFocus={false} />,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    const listBox = getByRole('listbox');
    fireEvent.keyDown(listBox, { key: 'ArrowDown' });
    fireEvent.keyDown(listBox, { key: 'Enter' });
    expect(button).toHaveTextContent('Banana');
  });
});

describe('className', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('adds default BEM classes', () => {
    const { container, getByRole, getAllByRole } = render(
      <DropDownWrapper options={options} />,
    );
    fireEvent.click(getByRole('button'));
    const listBox = getByRole('listbox');
    expect(container.querySelector('div')).toHaveClass('dropdown');
    expect(getByRole('button')).toHaveClass('dropdown__button');
    expect(getByRole('listbox')).toHaveClass('dropdown__listbox');
    expect(getAllByRole('option')[0]).toHaveClass('dropdown__option dropdown__option--focused');
    expect(getAllByRole('option')[1]).toHaveClass('dropdown__option');
    expect(getAllByRole('option')[2]).toHaveClass('dropdown__option dropdown__option--grouped');
    expect(getByRole('group')).toHaveClass('dropdown__group');

    fireEvent.keyDown(listBox, { key: 'ArrowDown' });
    fireEvent.keyDown(listBox, { key: 'ArrowDown' });
    expect(getByRole('group')).toHaveClass('dropdown__group dropdown__group--focused');
  });

  describe('when null', () => {
    it('does not insert classes', () => {
      const { container, getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} className={null} />,
      );
      fireEvent.click(getByRole('button'));
      expect(container.querySelector('div')).not.toHaveClass();
      expect(getByRole('button')).not.toHaveClass();
      expect(getByRole('listbox')).not.toHaveClass();
      expect(getAllByRole('option')[0]).not.toHaveClass();
      expect(getByRole('group')).not.toHaveClass();
    });
  });

  describe('when set', () => {
    it('it prefixes classes', () => {
      const { container, getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} className="foo" />,
      );
      fireEvent.click(getByRole('button'));
      const listBox = getByRole('listbox');
      expect(container.querySelector('div')).toHaveClass('foo');
      expect(getByRole('button')).toHaveClass('foo__button');
      expect(getByRole('listbox')).toHaveClass('foo__listbox');
      expect(getAllByRole('option')[0]).toHaveClass('foo__option foo__option--focused');
      expect(getAllByRole('option')[1]).toHaveClass('foo__option');
      expect(getAllByRole('option')[2]).toHaveClass('foo__option foo__option--grouped');
      expect(getByRole('group')).toHaveClass('foo__group');

      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      expect(getByRole('group')).toHaveClass('foo__group foo__group--focused');
    });
  });
});

describe('id', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('it prefixes all ids', () => {
    const { container, getByRole, getAllByRole } = render(
      <DropDownWrapper options={options} id="foo" />,
    );
    fireEvent.click(getByRole('button'));
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(getByRole('button')).toHaveAttribute('id', 'foo');
    expect(getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');
    expect(getByRole('group')).toHaveAttribute('id', 'foo_group_citrus');
  });
});

describe('ListBoxComponent', () => {
  it.todo('allows additional props to be added to the listbox');
  it.todo('allows the listbox to be replaced');
  it.todo('allows access to the context');
});

describe('ButtonComponent', () => {
  it.todo('allows additional props to be added to the button');
  it.todo('allows the button to be replaced');
  it.todo('allows access to the context');
});

describe('GroupComponent', () => {
  it.todo('allows additional props to be added to a group');
  it.todo('allows the group to be replaced');
  it.todo('allows access to the context with group properties');
});

describe('OptionComponent', () => {
  it.todo('allows additional props to be added to an option');
  it.todo('allows the option to be replaced');
  it.todo('allows access to the context with option properties');
});

describe('ValueComponent', () => {
  it.todo('allows the option value to be replaced');
  it.todo('allows access to the context with option properties');
});

describe('DropDownComponent', () => {
  it.todo('allows additional props to be added to the wrapper');
  it.todo('allows the wrapper to be replaced');
  it.todo('allows access to the context');
});


describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('includes them on the drop down wrapper', () => {
    const { container } = render(
      <DropDownWrapper options={options} data-foo="bar" />,
    );
    const dropDown = container.querySelector('div');
    expect(dropDown).toHaveAttribute('data-foo', 'bar');
  });
});
