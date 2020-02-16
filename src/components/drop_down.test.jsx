import React, { Fragment, useState, useContext, forwardRef } from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import { DropDown } from './drop_down.jsx';
import { Context } from '../context.js';

class PropUpdater {
  setUpdater(fn) {
    this.setter = fn;
  }

  update(value) {
    act(() => this.setter(value));
  }
}

function DropDownWrapper({ value: initialValue, propUpdater, ...props }) {
  const [value, onValue] = useState(initialValue);
  const [newProps, setProps] = useState(props);
  if (propUpdater) {
    propUpdater.setUpdater(setProps);
  }
  return (
    <DropDown id="id" value={value} onValue={onValue} {...newProps} />
  );
}

expect.extend({
  toHaveActiveOption(combobox, node) {
    if (!combobox) {
      return {
        pass: false,
        message: () => 'expected combobox to be provided',
      };
    }
    const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
    if (!listbox) {
      return {
        pass: false,
        message: () => 'expected listbox to be provided',
      };
    }
    if (listbox.hidden) {
      return {
        pass: false,
        message: () => 'expected listbox not to be hidden',
      };
    }
    if (!node) {
      return {
        pass: false,
        message: () => 'expected option to be provided',
      };
    }
    if (document.activeElement !== node) {
      return {
        pass: false,
        message: () => `expected active element (${document.activeElement.outerHTML}) to eq ${node.outerHTML}`,
      };
    }
    if (combobox.getAttribute('aria-activedescendant') !== node.id) {
      return {
        pass: false,
        message: () => `expected combobox aria-activedescendant to eq ${node.id}`,
      };
    }
    if (listbox.getAttribute('aria-activedescendant') !== node.id) {
      return {
        pass: false,
        message: () => `expected listbox aria-activedescendant to eq ${node.id}`,
      };
    }
    if (node.getAttribute('aria-selected') !== 'true') {
      return {
        pass: false,
        message: () => `expected ${node.outerHTML} to have aria-selected="true"`,
      };
    }
    return {
      pass: true,
      message: () => 'expected the node not be the selected option',
    };
  },
});

afterEach(async () => {
  // Fix act warning due to the focus event triggering after a timeout
  await wait();
});

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed drop down', () => {
        const { container, getByRole } = render(<DropDownWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      it('renders a drop down with a selected value', () => {
        const { getByRole } = render(<DropDownWrapper options={options} value="Orange" />);
        expect(getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('expanding the list box', () => {
        describe('with no value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the first option selected', () => {
              const { getAllByRole, getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });

            it('does not open the drop down with a right mouse click', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'), { button: 1 });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
          });

          describe('pressing enter', () => {
            it('opens drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: ' ' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });

            it('opens the drop down with the down arrow + alt', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown', altKey: true });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            });

            it('does not open the drop down with the up arrow + alt', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp', altKey: true });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
          });
        });

        describe('with a value', () => {
          describe('by clicking', () => {
            it('opens the drop down with the value selected', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.click(getByRole('combobox'));
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });
          });

          describe('pressing enter', () => {
            it('opens drop down with the value selected', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'Enter' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });
          });

          describe('pressing space', () => {
            it('opens the drop down', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: ' ' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });
          });

          describe('pressing down arrow', () => {
            it('opens the drop down with the down arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });

            it('opens the drop down with the down arrow + alt', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown', altKey: true });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });
          });

          describe('pressing up arrow', () => {
            it('opens the drop down with the up arrow', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Orange" />);
              fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowUp' });
              expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            });
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the next option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the first option from the last option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing with the alt key pressed', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the up arrow', () => {
          it('moves to the previous option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves to the last option from the first option', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the home key', () => {
          it('moves to the first option with the home key', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'Home' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the end key', () => {
          it('moves to the last option with the end key', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} value="Banana" onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'End' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('typing', () => {
          it('moves the option when typing without calling onValue', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing case-insensitively', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'B' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
          });

          it('does not moves the option if there is no match', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'z' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
          });

          it('moves the option when typing multiple letters', () => {
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={similarOptions} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
          });

          it('resets typing after a short delay', () => {
            jest.useFakeTimers();
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            act(() => jest.advanceTimersByTime(1000));
            fireEvent.keyDown(document.activeElement, { key: 'o' });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
          });

          it('does nothing if the meta key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', metaKey: true });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
          });

          it('does nothing if the control key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', ctrlKey: true });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
          });

          it('does nothing if the alt key is pressed', () => {
            const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'b', altKey: true });
            expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole, getAllByRole } = render((
                <DropDownWrapper options={options} onValue={spy} />
              ));
              fireEvent.click(getByRole('combobox'));
              fireEvent.click(getAllByRole('option')[1]);
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.click(getAllByRole('option')[1]);
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.click(getAllByRole('option')[1]);
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });

            it('does nothing if a different mouse button is pressed', () => {
              const spy = jest.fn();
              const { getByRole, getAllByRole } = render((
                <DropDownWrapper options={options} onValue={spy} />
              ));
              fireEvent.click(getByRole('combobox'));
              fireEvent.click(getAllByRole('option')[1], { button: 1 });
              expect(getByRole('listbox')).toBeVisible();
              expect(getByRole('combobox')).toHaveTextContent('Apple');
              expect(spy).not.toHaveBeenCalled();
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.click(getAllByRole('option')[1]);
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('when pressing enter on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('when pressing escape on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Escape' });
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Escape' });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Escape' });
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'Escape' });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('when pressing tab on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab' });
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab' });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab' });
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'Tab' });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('when pressing shift + tab on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('when pressing ArrowUp + alt on an option', () => {
          describe('when the value is not the current value', () => {
            it('calls onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
            });

            it('closes the list box and selects the combobox', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });

            it('updates the displayed value', () => {
              const { getByRole } = render(<DropDownWrapper options={options} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              expect(getByRole('combobox')).toHaveTextContent('Banana');
            });
          });

          describe('when the value is the current value', () => {
            it('closes the listbox without calling onValue', () => {
              const spy = jest.fn();
              const { getByRole } = render(<DropDownWrapper options={options} value="Banana" onValue={spy} />);
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              expect(document.activeElement).toEqual(getByRole('combobox'));
            });
          });
        });

        describe('typing in a closed list box', () => {
          it('selects the option when typing', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('selects the option when typing case-insensitively', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'B' });
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('does not select the option if there is no match', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'z' });
            expect(spy).not.toHaveBeenCalled();
          });

          it('moves the option when typing multiple letters', () => {
            const spy = jest.fn();
            const similarOptions = [{ label: 'Banana' }, { label: 'Blackberry' }];
            const { getByRole } = render((
              <DropDownWrapper options={similarOptions} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(spy).toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('resets typing after a short delay', () => {
            const spy = jest.fn();
            jest.useFakeTimers();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b' });
            act(() => jest.advanceTimersByTime(1000));
            fireEvent.keyDown(document.activeElement, { key: 'l' });
            expect(spy).not.toHaveBeenCalledWith({ label: 'Blackberry' });
          });

          it('does nothing if the metaKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', metaKey: true });
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the ctrlKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', ctrlKey: true });
            expect(spy).not.toHaveBeenCalled();
          });

          it('does nothing if the altKey is pressed', () => {
            const spy = jest.fn();
            const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'b', altKey: true });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('when blurring the listbox', () => {
          describe('when the value has changed', () => {
            it('calls onValue', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <DropDownWrapper options={options} onValue={spy} />
                  <input />
                </>
              ));
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              getByRole('textbox').focus();
              await wait(() => {
                expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
              });
            });

            it('closes the list box without removing the focus', async () => {
              const { getByRole } = render((
                <>
                  <DropDownWrapper options={options} />
                  <input />
                </>
              ));
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              getByRole('textbox').focus();
              await wait(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(document.activeElement).toEqual(getByRole('textbox'));
            });

            it('updates the displayed value', async () => {
              const { getByRole } = render((
                <>
                  <DropDownWrapper options={options} />
                  <input />
                </>
              ));
              fireEvent.click(getByRole('combobox'));
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              getByRole('textbox').focus();
              await wait(() => {
                expect(getByRole('combobox')).toHaveTextContent('Banana');
              });
            });
          });

          describe('when the value has not changed', () => {
            it('closes the listbox without calling onValue', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <DropDownWrapper options={options} value="Banana" onValue={spy} />
                  <input />
                </>
              ));
              fireEvent.click(getByRole('combobox'));
              getByRole('textbox').focus();
              await wait(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(spy).not.toHaveBeenCalled();
              expect(document.activeElement).toEqual(getByRole('textbox'));
            });
          });
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container, getByRole, getAllByRole } = render((
          <DropDownWrapper options={options} />
        ));
        fireEvent.click(getByRole('combobox'));
        expect(container).toMatchSnapshot();
        expect(getAllByRole('option')[1]).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
      });

      it('does not select a disabled option by typing', () => {
        const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'b' });
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
      });

      describe('first option is disabled', () => {
        const disabledFirstOptions = [{ label: 'Apple', disabled: true }, 'Banana'];

        it('defaults selection to the first non-disabled option', () => {
          const { getByRole, getAllByRole } = render((
            <DropDownWrapper options={disabledFirstOptions} />
          ));
          fireEvent.click(getByRole('combobox'));
          expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
        });
      });

      describe('only disabled options', () => {
        const onlyDisabledOptions = [
          { label: 'Apple', disabled: true },
          { label: 'Banana', disabled: true },
        ];

        it('defaults selection to the first non-disabled option', () => {
          const { getByRole } = render((
            <DropDownWrapper options={onlyDisabledOptions} />
          ));
          fireEvent.click(getByRole('combobox'));
          expect(document.activeElement).toEqual(getByRole('listbox'));
          expect(getByRole('combobox')).not.toHaveAttribute('aria-activedescendant');
        });
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox')).toBeVisible();
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox')).toBeVisible();
          });
        });

        describe('when pressing escape on an option', () => {
          it('closes the listbox but does not select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Escape' });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
          });
        });

        describe('when pressing tab on an option', () => {
          it('closes the listbox but does not select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab' });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
          });
        });

        describe('when pressing shift + tab on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
          });
        });

        describe('when pressing arrow up + alt on an option', () => {
          it('closes the listbox without selecting the item', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <DropDownWrapper options={options} onValue={spy} />
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expect(spy).not.toHaveBeenCalled();
            expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            expect(document.activeElement).toEqual(getByRole('combobox'));
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <DropDownWrapper options={options} onValue={spy} />
                <input />
              </>
            ));
            fireEvent.click(getByRole('combobox'));
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            getByRole('textbox').focus();
            await wait(() => {
              expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
            });
            expect(spy).not.toHaveBeenCalled();
            expect(document.activeElement).toEqual(getByRole('textbox'));
          });
        });
      });
    });

    describe('value', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', value: 1 }, { label: 'foo', value: 2 }, { label: 'foo', value: 3 }];
        const spy = jest.fn();
        const { getByRole, getAllByRole } = render(
          <DropDownWrapper options={options} value={2} onValue={spy} />,
        );
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', value: 3 });
      });
    });

    describe('id', () => {
      it('is used as a options identity', () => {
        const options = [{ label: 'foo', id: 1 }, { label: 'foo', id: 2 }, { label: 'foo', id: 3 }];
        const spy = jest.fn();
        const { getByRole, getAllByRole } = render(
          <DropDownWrapper options={options} value={2} onValue={spy} />,
        );
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { getByRole } = render(
          <DropDownWrapper options={options} />,
        );
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(getByRole('option')).toHaveAttribute('class', 'class');
      });

      describe('html id', () => {
        it('is used as the options id', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          const { getByRole } = render(
            <DropDownWrapper options={options} />,
          );
          fireEvent.click(getByRole('combobox'));
          expect(getByRole('option')).toHaveAttribute('id', 'xxx');
          expect(getByRole('combobox')).toHaveActiveOption(getByRole('option'));
        });

        it('will not use duplicate ids', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          const { getByRole, getAllByRole } = render(
            <DropDownWrapper options={options} />,
          );
          fireEvent.click(getByRole('combobox'));
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expect(getAllByRole('option')[0]).toHaveAttribute('id', 'xxx');
          expect(getAllByRole('option')[1]).toHaveAttribute('id', 'xxx_1');
          expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
        });
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

      it('does not select a group with the arrow keys', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(document.activeElement).toHaveTextContent('Orange');
      });

      it('does not select a group by typing', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'c' });
        expect(document.activeElement).toHaveTextContent('Apple');
      });

      it('triggers onValue when an option is selected', () => {
        const spy = jest.fn();
        const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(getByRole('combobox')).toHaveTextContent('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { getByRole, getByText } = render(
            <DropDownWrapper options={options} onValue={spy} />,
          );
          fireEvent.click(getByRole('combobox'));
          fireEvent.click(getByText('Citrus'));
          expect(spy).not.toHaveBeenCalled();
          expect(getByRole('listbox')).toBeVisible();
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { getByRole } = render(<DropDownWrapper options={options} />);
        fireEvent.click(getByRole('combobox'));
        expect(getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed drop down', () => {
      const { getByRole, container } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('Banana');
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      expect(document.activeElement).toEqual(getByRole('combobox'));
    });
  });

  describe('options as array of numbers', () => {
    const options = [1, 2, 3];

    it('renders a closed drop down', () => {
      const { container, getByRole } = render(<DropDownWrapper options={options} />);
      expect(container).toMatchSnapshot();
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<DropDownWrapper options={options} onValue={spy} />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(2);
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      expect(document.activeElement).toEqual(getByRole('combobox'));
    });
  });

  describe('no options', () => {
    it('does not open the listbox of click', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      fireEvent.click(getByRole('combobox'));
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('displays a none breaking space as the current selection', () => {
      const { getByRole } = render(
        <DropDownWrapper options={[]} />,
      );
      expect(getByRole('combobox').textContent).toEqual('\u00A0');
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { getByRole, getByText } = render(<DropDownWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.click(getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { getByRole, getByText } = render(<DropDownWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      fireEvent.click(getByRole('combobox'));
      fireEvent.click(getByText('Orange'));
      expect(getByRole('combobox')).toHaveTextContent('Orange');
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];

    it('updates the options', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, options: newOptions }));
      expect(container).toMatchSnapshot();
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<DropDownWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('resets the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<DropDownWrapper
          options={options}
          propUpdater={propUpdater}
          value="Orange"
        />);
        fireEvent.click(getByRole('combobox'));
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
      });
    });
  });
});

describe('value', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('sets the initial focused option', () => {
    const { getAllByRole, getByRole } = render((
      <DropDownWrapper options={options} value="Banana" />
    ));
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[1]);
  });

  describe('value is not in options', () => {
    it('sets the initial focused option to the first option', () => {
      const { getAllByRole, getByRole } = render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      fireEvent.click(getByRole('combobox'));
      expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
    });

    it('displays value as the combo box label', () => {
      const { getByRole } = render((
        <DropDownWrapper options={options} value="Strawberry" />
      ));
      expect(getByRole('combobox')).toHaveTextContent('Strawberry');
    });
  });

  describe('updating the value', () => {
    it('does not update the aria-selected value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole, getAllByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expect(container.querySelector('[aria-selected="true"]')).toEqual(getAllByRole('option')[2]);
    });

    it('does not close an open list box', () => {
      const propUpdater = new PropUpdater();
      const { getByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expect(getByRole('listbox')).toBeVisible();
    });

    it('does not change the focused value', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<DropDownWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[2]);
    });
  });
});


describe('blank', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders a blank option', () => {
    const { container, getByRole, getAllByRole } = render(<DropDownWrapper options={options} blank="Please select…" />);
    expect(container).toMatchSnapshot();
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
    expect(getAllByRole('option')[0]).toHaveTextContent('Please select…');
  });

  it('renders with a selected value', () => {
    const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} blank="Please select…" value="Orange" />);
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[3]);
  });

  it('renders with value as null', () => {
    const { getByRole, getAllByRole } = render(<DropDownWrapper options={options} blank="Please select…" value={null} />);
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('combobox')).toHaveActiveOption(getAllByRole('option')[0]);
  });

  it('allows a blank option to be selected', () => {
    const spy = jest.fn();
    const { getByRole, getByText } = render(<DropDownWrapper
      options={options}
      blank="Please select…"
      value="Orange"
      onValue={spy}
    />);
    fireEvent.click(getByRole('combobox'));
    fireEvent.click(getByText('Please select…'));
    expect(spy).toHaveBeenCalledWith(null);
  });
});

describe('children', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('renders children in the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} blank="Please select…">
        Custom text
      </DropDownWrapper>,
    );
    expect(getByRole('combobox')).toHaveTextContent('Custom text');
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      const { getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      fireEvent.click(comboBox);
      const listBox = getByRole('listbox');
      expect(document.activeElement).toEqual(listBox);
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      expect(document.activeElement).toEqual(listBox);
      expect(comboBox).toHaveAttribute('aria-activedescendant', getAllByRole('option')[1].id);
    });

    it('allows an option to be selected', () => {
      const { getByRole } = render(
        <DropDownWrapper options={options} managedFocus={false} />,
      );
      const combobox = getByRole('combobox');
      fireEvent.click(combobox);
      const listBox = getByRole('listbox');
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      fireEvent.keyDown(listBox, { key: 'Enter' });
      expect(combobox).toHaveTextContent('Banana');
    });
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
    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).toHaveClass('dropdown');
    expect(getByRole('combobox')).toHaveClass('dropdown__combobox');
    expect(getByRole('listbox')).toHaveClass('dropdown__listbox');
    expect(getAllByRole('option')[0]).toHaveClass('dropdown__option dropdown__option--focused');
    expect(getAllByRole('option')[1]).toHaveClass('dropdown__option');
    expect(getAllByRole('option')[2]).toHaveClass('dropdown__option dropdown__option--grouped');
    expect(getAllByRole('option')[1].nextElementSibling).toHaveClass('dropdown__group');
  });

  describe('when null', () => {
    it('does not insert classes', () => {
      const { container, getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} className={null} />,
      );
      fireEvent.click(getByRole('combobox'));
      expect(container.querySelector('div')).not.toHaveClass();
      expect(getByRole('combobox')).not.toHaveClass();
      expect(getByRole('listbox')).not.toHaveClass();
      expect(getAllByRole('option')[0]).not.toHaveClass();
      expect(getAllByRole('option')[2]).not.toHaveClass();
    });
  });

  describe('when set', () => {
    it('it prefixes classes', () => {
      const { container, getByRole, getAllByRole } = render(
        <DropDownWrapper options={options} className="foo" />,
      );
      fireEvent.click(getByRole('combobox'));
      expect(container.querySelector('div')).toHaveClass('foo');
      expect(getByRole('combobox')).toHaveClass('foo__combobox');
      expect(getByRole('listbox')).toHaveClass('foo__listbox');
      expect(getAllByRole('option')[0]).toHaveClass('foo__option foo__option--focused');
      expect(getAllByRole('option')[1]).toHaveClass('foo__option');
      expect(getAllByRole('option')[2]).toHaveClass('foo__option foo__option--grouped');
      expect(getAllByRole('option')[1].nextElementSibling).toHaveClass('foo__group');
    });
  });
});

describe('classGenerator', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('allows custom class generation', () => {
    const spy = jest.fn((name) => (
      (...names) => `${names.filter(Boolean).join('-')}-${name}`
    ));

    const { container, getByRole, getAllByRole } = render(
      <DropDownWrapper options={options} className="foo" classGenerator={spy} />,
    );

    expect(spy).toHaveBeenCalledWith('foo');

    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).toHaveClass('foo');
    expect(getByRole('combobox')).toHaveClass('combobox-foo');
    expect(getByRole('listbox')).toHaveClass('listbox-foo');
    expect(getAllByRole('option')[0]).toHaveClass('option-focused-foo');
    expect(getAllByRole('option')[1]).toHaveClass('option-foo');
    expect(getAllByRole('option')[2]).toHaveClass('option-grouped-foo');
    expect(getAllByRole('option')[1].nextElementSibling).toHaveClass('group-foo');
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
    fireEvent.click(getByRole('combobox'));
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');
    expect(getAllByRole('option')[1].nextElementSibling).toHaveAttribute('id', 'foo_group_citrus');
  });
});

describe('required', () => {
  it('when false it does not set aria-required on the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} required={false} />,
    );
    expect(getByRole('combobox')).not.toHaveAttribute('aria-required');
  });

  it('when true it sets aria-required on the combobox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['one', 'two']} required />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-required', 'true');
  });
});

describe('disabled', () => {
  describe('when false', () => {
    it('does not set aria-disabld on the combobox', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled={false} />,
      );
      expect(getByRole('combobox')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('when true', () => {
    it('it sets aria-disabled on the combobox', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open the listbox of click', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.click(getByRole('combobox'));
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('does not change the value when pressing a key', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <DropDownWrapper options={['one', 'two']} disabled onValue={spy} />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 't' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped', () => {
    function skipOption(option) {
      return option === 'Pear';
    }
    const { getByRole } = render(
      <DropDownWrapper options={options} skipOption={skipOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(document.activeElement).toHaveTextContent('Orange');
  });
});

describe('findOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows search options to be skipped', () => {
    const findOption = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return false;
      }
      return true;
    });

    const { getByRole } = render(
      <DropDownWrapper options={options} findOption={findOption} />,
    );
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'b' });
    expect(document.activeElement).toHaveTextContent('Orange');
    expect(findOption.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'b'],
      [expect.objectContaining({ value: 'Pear' }), 'b'],
      [expect.objectContaining({ value: 'Orange' }), 'b'],
    ]);
  });
});

describe('WrapperComponent', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <DropDownWrapper options={['foo']} WrapperComponent="dl" />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
  });

  it('allows the wrapper to be a fragment', () => {
    const { container, getByRole } = render(
      <DropDownWrapper options={['foo']} WrapperComponent={Fragment} />,
    );
    expect(getByRole('combobox')).toEqual(container.firstChild);
  });

  it('allows access to the context', () => {
    const spy = jest.fn();

    function WrapperComponent(props) {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    }

    render(
      <DropDownWrapper foo="bar" options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        focusedOption: expect.any(Object),
        search: '',
        expanded: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
    });
  });

  it('allows custom layouts', () => {
    function WrapperComponent(props) {
      const { children: [comboBox, listBox] } = props;

      return (
        <div {...props}>
          <div className="combobox-wrapper">
            {comboBox}
          </div>
          <div className="listbox-wrapper">
            {listBox}
          </div>
        </div>
      );
    }

    const { container } = render(
      <DropDownWrapper options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(container).toMatchSnapshot();
  });
});

describe('wrapperProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { container } = render(
      <DropDownWrapper options={['foo']} wrapperProps={{ 'data-foo': 'bar' }} />,
    );
    expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ComboBoxComponent', () => {
  it('allows the combobox to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} ComboBoxComponent="dl" />,
    );
    expect(getByRole('combobox').tagName).toEqual('DL');
  });
});

describe('comboBoxProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} comboBoxProps={{ 'data-foo': 'bar' }} />,
    );
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ListBoxComponent', () => {
  it('allows the listbox to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} ListBoxComponent="dl" />,
    );
    expect(getByRole('listbox', { hidden: true }).tagName).toEqual('DL');
  });

  it('allows access to the context', () => {
    const spy = jest.fn();

    const ListBoxComponent = forwardRef((props, _) => {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    });

    render(
      <DropDownWrapper foo="bar" options={['foo']} ListBoxComponent={ListBoxComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        focusedOption: expect.any(Object),
        search: '',
        expanded: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
    });
  });
});

describe('listBoxProps', () => {
  it('allows custom props to be added to the listbox', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} listBoxProps={{ 'data-foo': 'bar' }} />,
    );
    expect(getByRole('listbox', { hidden: true })).toHaveAttribute('data-foo', 'bar');
  });
});

describe('GroupWrapperComponent', () => {
  it('allows the group wrapper to be replaced', () => {
    const { container } = render(
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} GroupWrapperComponent="dl" />,
    );
    expect(container.querySelector('dl').firstChild).toHaveClass('dropdown__group');
  });

  it('allows access to the context with group properties', () => {
    const spy = jest.fn();

    function GroupWrapperComponent(props) {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    }

    render(
      <DropDownWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} GroupWrapperComponent={GroupWrapperComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        focusedOption: expect.any(Object),
        search: '',
        expanded: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
      group: expect.objectContaining({
        label: 'bar',
        options: expect.any(Array),
      }),
    });
  });
});

describe('groupWrapperProps', () => {
  it('allows custom props', () => {
    const { container } = render(
      <DropDownWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupWrapperComponent="dl"
        groupWrapperProps={{ 'data-foo': 'bar' }}
      />,
    );
    expect(container.querySelector('dl')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('GroupLabelComponent', () => {
  it('allows the group to be replaced', () => {
    const { container } = render(
      <DropDownWrapper options={[{ label: 'foo', group: 'bar' }]} GroupLabelComponent="dl" />,
    );
    expect(container.querySelector('dl')).toHaveTextContent('bar');
  });

  it('allows access to the context with group properties', () => {
    const spy = jest.fn();

    function GroupLabelComponent(props) {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    }

    render(
      <DropDownWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} GroupLabelComponent={GroupLabelComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        focusedOption: expect.any(Object),
        search: '',
        expanded: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
      group: expect.objectContaining({
        label: 'bar',
        options: expect.any(Array),
      }),
    });
  });
});

describe('groupLabelProps', () => {
  it('allows custom props', () => {
    const { container } = render(
      <DropDownWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupLabelComponent="dl"
        groupLabelProps={{ 'data-foo': 'bar' }}
      />,
    );
    expect(container.querySelector('dl')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('OptionComponent', () => {
  it('allows the option to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} OptionComponent="dl" />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').tagName).toEqual('DL');
  });

  it('allows access to the context with option and group properties', () => {
    const spy = jest.fn();

    const OptionComponent = forwardRef((props, _) => {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    });

    render(
      <DropDownWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} OptionComponent={OptionComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        focusedOption: expect.any(Object),
        search: '',
        expanded: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
      group: expect.objectContaining({
        label: 'bar',
        options: expect.any(Array),
      }),
      option: expect.objectContaining({
        label: 'foo',
        group: expect.objectContaining({
          label: 'bar',
        }),
      }),
    });
  });
});

describe('optionProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <DropDownWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        optionProps={{ 'data-foo': 'bar' }}
      />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ValueComponent', () => {
  it('allows the component to be replaced', () => {
    const { getByRole } = render(
      <DropDownWrapper options={['foo']} ValueComponent="dl" />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
  });
});

describe('valueProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <DropDownWrapper
        options={['foo']}
        valueProps={{ 'data-foo': 'bar' }}
      />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });
});

describe('additional props', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('does not include arbitrary props', () => {
    const { container } = render(
      <DropDownWrapper options={options} foo="bar" />,
    );
    expect(container.querySelector('[foo="bar"]')).toEqual(null);
  });

  it('includes all data attributes on the combo box', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} data-foo="bar" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('includes all aria attributes on the combo box', () => {
    const { getByRole } = render(
      <DropDownWrapper options={options} aria-invalid="true" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
  });
});

describe('layoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the listbox is displayed', () => {
    const layoutListBox = jest.fn();
    const { getByRole } = render(
      <DropDownWrapper options={options} layoutListBox={layoutListBox} />,
    );
    expect(layoutListBox).not.toHaveBeenCalled();
    fireEvent.click(getByRole('combobox'));
    expect(layoutListBox).toHaveBeenCalledWith({
      listBox: getByRole('listbox'),
      comboBox: getByRole('combobox'),
      option: document.activeElement,
    });
  });

  it('is called when the listbox options change', () => {
    const propUpdater = new PropUpdater();
    const layoutListBox = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        layoutListBox={layoutListBox}
        propUpdater={propUpdater}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(layoutListBox).toHaveBeenCalledTimes(2);
    expect(layoutListBox).toHaveBeenLastCalledWith({
      listBox: getByRole('listbox'),
      comboBox: getByRole('combobox'),
      option: document.activeElement,
    });
  });

  it('is called when the selected option changes', () => {
    const layoutListBox = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(layoutListBox).toHaveBeenCalledTimes(2);
    expect(layoutListBox).toHaveBeenLastCalledWith({
      listBox: getByRole('listbox'),
      comboBox: getByRole('combobox'),
      option: document.activeElement,
    });
  });

  it('is not called when a listbox closed', () => {
    const layoutListBox = jest.fn();
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(layoutListBox).toHaveBeenCalledTimes(1);
  });

  it('sets the list box style and classes', () => {
    const layoutListBox = jest.fn(() => ({ style: { color: 'red' }, className: 'foo' }));
    const { getByRole } = render((
      <DropDownWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('listbox')).toHaveStyle('color: red');
    expect(getByRole('listbox')).toHaveAttribute('class', 'dropdown__listbox foo');
  });
});
