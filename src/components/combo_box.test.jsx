import React, { useState, useContext, forwardRef } from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComboBox } from './combo_box.jsx';
import { Context } from '../context.js';

class PropUpdater {
  setUpdater(fn) {
    this.setter = fn;
  }

  update(value) {
    act(() => this.setter(value));
  }
}

const ComboBoxWrapper = forwardRef(({ value: initialValue, propUpdater, ...props }, ref) => {
  const [value, onValue] = useState(initialValue);
  const [newProps, setProps] = useState(props);
  if (propUpdater) {
    propUpdater.setUpdater(setProps);
  }
  return (
    <ComboBox id="id" value={value} onValue={onValue} {...newProps} ref={ref} />
  );
});

function expectToBeClosed(combobox) { // and focused
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(document.activeElement).toEqual(combobox);
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).not.toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'false');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
}

function expectToHaveNotFoundMessage(combobox, message) {
  expectToBeClosed(combobox);
  const id = `${combobox.id}_not_found`;
  expect(combobox.getAttribute('aria-describedby').split(/\s+/)).toContain(id);
  const notFound = document.getElementById(id);
  expect(notFound).toBeVisible();
  expect(notFound).toHaveTextContent(message);
}

function expectNotToHaveNotFoundMessage(combobox) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const id = `${combobox.id}_not_found`;
  if (combobox.getAttribute('aria-describedby')) {
    expect(combobox.getAttribute('aria-describedby').split(/\s+/)).not.toContain(id);
  }
  const notFound = document.getElementById(id);
  expect(notFound).not.toBeVisible();
  expect(notFound).not.toHaveTextContent();
}

function expectToBeOpen(combobox) { // and focused with no selected or focused option
  expect(combobox).toHaveAttribute('role', 'combobox');
  expect(document.activeElement).toEqual(combobox);
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expectNotToHaveNotFoundMessage(combobox);
}

function expectToHaveFocusedOption(combobox, option) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).toHaveAttribute('aria-activedescendant', option.id);
  expect(listbox).toHaveAttribute('aria-activedescendant', option.id);
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(document.activeElement).toEqual(option);
  expectNotToHaveNotFoundMessage(combobox);
}

function expectToHaveSelectedOption(combobox, option) {
  expect(combobox).toHaveAttribute('role', 'combobox');
  const listbox = document.getElementById(combobox.getAttribute('aria-controls'));
  expect(listbox).toHaveAttribute('role', 'listbox');
  expect(listbox).toBeVisible();
  expect(combobox).toHaveAttribute('aria-expanded', 'true');
  expect(combobox).not.toHaveAttribute('aria-activedescendant');
  expect(listbox).not.toHaveAttribute('aria-activedescendant');
  expect(option).toHaveAttribute('role', 'option');
  expect(option).toHaveAttribute('aria-selected', 'true');
  expect(document.activeElement).toEqual(combobox);
  expectNotToHaveNotFoundMessage(combobox);
}

afterEach(async () => {
  // Fix act warning due to the focus event triggering after a timeout
  await wait();
});

describe('options', () => {
  describe('as array of objects', () => {
    describe('label', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana' }, { label: 'Orange' }];

      it('renders a closed combo box', () => {
        const { container, getByRole } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      describe('focusing the list box', () => {
        it('opens the combo box with no option selected', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          expectToBeOpen(getByRole('combobox'));
        });

        describe('with no options it does not open the list box', () => {
          it('does not open the combo box', () => {
            const { getByRole } = render(<ComboBoxWrapper options={[]} />);
            getByRole('combobox').focus();
            expectToBeClosed(getByRole('combobox'));
          });
        });
      });

      describe('navigating options in an open listbox', () => {
        describe('pressing the down arrow', () => {
          it('moves to the first option from the input', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });

          it('moves to the next option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('moves from the last option to the input', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToBeOpen(getByRole('combobox'));
          });

          it('does nothing with the alt key pressed', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing the up arrow', () => {
          it('moves from the input to the last option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
          });

          it('moves to the previous option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });

          it('moves from the first option to the input', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing the home key', () => {
          describe('on a mac', () => {
            it('moves to the first option with the home key', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box', () => {
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              expectToBeOpen(getByRole('combobox'));
            });
          });
        });

        describe('pressing the end key', () => {
          describe('on a mac', () => {
            it('moves to the last option with the end key', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });

        describe('typing', () => {
          it('moves focus back to the list box', async () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            await userEvent.type(document.activeElement, 'a');
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing backspace', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Backspace' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing arrow left', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowLeft' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing arrow right', () => {
          it('moves focus back to the list box', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowRight' });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });

        describe('pressing delete', () => {
          it('moves focus back to the list box removing the selected option', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Delete' });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('pressing Ctrl+d', () => {
          describe('on a mac', () => {
            it('moves focus back to the list box removing the selected option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
              expectToBeOpen(getByRole('combobox'));
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box removing the selected option', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'd', ctrlKey: true });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });

        describe('pressing Ctrl+k', () => {
          describe('on a mac', () => {
            it('moves focus back to the list box removing the selected option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
              expectToBeOpen(getByRole('combobox'));
            });
          });

          describe('on other systems', () => {
            it('moves focus back to the list box removing the selected option', () => {
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'k', ctrlKey: true });
              expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
            });
          });
        });
      });

      describe('selecting an option', () => {
        describe('when clicking on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).toHaveBeenCalledWith({ label: 'Banana' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expectToBeClosed(getByRole('combobox'));
          });

          it('updates the displayed value', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(getByRole('combobox')).toHaveValue('Banana');
          });

          it('does nothing if a different mouse button is pressed', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1], { button: 1 });
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen(getByRole('combobox'));
          });

          it('cancels mousedown', () => {
            const spy = jest.fn();
            document.addEventListener('mousedown', spy);
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.mouseDown(getAllByRole('option')[1]);
            expect(spy.mock.calls[0][0].defaultPrevented).toEqual(true);
            document.removeEventListener('mousedown', spy);
          });
        });

        describe('when pressing enter on an option', () => {
          it('calls onValue', () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
          });

          it('closes the list box and selects the combobox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expectToBeClosed(getByRole('combobox'));
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(getByRole('combobox')).toHaveValue('Apple');
          });
        });

        describe('when blurring the combobox', () => {
          describe('when the value has changed', () => {
            it('calls onValue', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} onValue={spy} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              userEvent.tab();
              await wait(() => {
                expect(spy).toHaveBeenCalledWith({ label: 'Apple' });
              });
            });

            it('closes the list box without removing the focus', async () => {
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              userEvent.tab();
              await wait(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(document.activeElement).toEqual(getByRole('textbox'));
            });

            it('updates the displayed value', async () => {
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              userEvent.tab();
              await wait(() => {
                expect(getByRole('combobox')).toHaveValue('Apple');
              });
            });
          });

          describe('when the value has not changed', () => {
            it('closes the listbox without calling onValue', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} onValue={spy} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'Enter' });
              spy.mockClear();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              userEvent.tab();
              await wait(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(spy).not.toHaveBeenCalled();
              expect(document.activeElement).toEqual(getByRole('textbox'));
            });
          });

          describe('when no option has been selected', () => {
            it('closes the list box and clears the search', async () => {
              const spy = jest.fn();
              const { getByRole } = render((
                <>
                  <ComboBoxWrapper options={options} onValue={spy} />
                  <input />
                </>
              ));
              getByRole('combobox').focus();
              await userEvent.type(document.activeElement, 'app');
              userEvent.tab();
              await wait(() => {
                expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
              });
              expect(spy).not.toHaveBeenCalled();
              expect(getByRole('combobox')).toHaveValue('');
            });
          });
        });
      });

      describe('when pressing escape on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed(getByRole('combobox'));
        });

        it('clears the focused value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToBeOpen(getByRole('combobox'));
        });

        it('keeps the current value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Enter' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expectToBeClosed(getByRole('combobox'));
          expect(getByRole('combobox')).toHaveValue('Apple');
        });
      });

      describe('when pressing ArrowUp + alt on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          expectToBeClosed(getByRole('combobox'));
        });

        it('keeps the focused value', () => {
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('on a closed listbox', () => {
        describe('pressing arrow down + alt', () => {
          it('opens the listbox', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('pressing arrow down', () => {
          it('opens the listbox', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('pressing arrow up', () => {
          it('opens the listbox', () => {
            const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('pressing arrow up + alt', () => {
          it('does not open the listbox', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            expectToBeClosed(getByRole('combobox'));
          });
        });

        describe('pressing Enter', () => {
          it('does not select an option', () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('pressing the Home key', () => {
          describe('on a mac', () => {
            it('does not change the option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              fireEvent.keyDown(document.activeElement, { key: 'Home' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            });
          });
        });

        describe('pressing the End key', () => {
          describe('on a mac', () => {
            it('does not change the option', () => {
              jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
              const { getByRole, getAllByRole } = render((
                <ComboBoxWrapper options={options} />
              ));
              getByRole('combobox').focus();
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
              fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
              fireEvent.keyDown(document.activeElement, { key: 'End' });
              fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
              expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
            });
          });
        });
      });

      describe('refocusing the listbox', () => {
        it('removes focus from the list box keeping the current selection', () => {
          const { getByRole, getAllByRole } = render((
            <ComboBoxWrapper options={options} value="Orange" />
          ));
          getByRole('combobox').focus();
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          getByRole('combobox').focus();
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('setting the search to an empty string', () => {
        describe('without an existing value', () => {
          it('does not call onValue', async () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).not.toHaveBeenCalled();
          });
        });

        describe('with an existing value', () => {
          it('calls onValue with null', () => {
            const spy = jest.fn();
            const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} value="Apple" />);
            getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(spy).toHaveBeenCalledWith(null);
          });

          it('clears the existing option', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} value="Apple" />);
            getByRole('combobox').focus();
            fireEvent.change(document.activeElement, { target: { value: '' } });
            expect(document.activeElement).toHaveValue('');
          });
        });
      });

      describe('remove button', () => {
        it('is not present without a value', () => {
          render(<ComboBoxWrapper options={options} />);
          const remove = document.getElementById('id_clear_button');
          expect(remove).not.toBeVisible();
        });

        it('pressing the button removes the value', () => {
          const spy = jest.fn();
          render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
          const remove = document.getElementById('id_clear_button');
          expect(remove).toBeVisible();
          userEvent.click(remove);
          expect(spy).toHaveBeenCalledWith(null);
        });

        it('pressing the middle button does not remove the value', () => {
          const spy = jest.fn();
          render(<ComboBoxWrapper options={options} value="Apple" onValue={spy} />);
          const remove = document.getElementById('id_clear_button');
          expect(remove).toBeVisible();
          fireEvent.click(remove, { button: 1 });
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe('disabled', () => {
      const options = [{ label: 'Apple' }, { label: 'Banana', disabled: true }];

      it('sets the aria-disabled attribute', () => {
        const { container, getByRole, getAllByRole } = render((
          <ComboBoxWrapper options={options} />
        ));
        getByRole('combobox').focus();
        expect(container).toMatchSnapshot();
        expect(getAllByRole('option')[1]).toHaveAttribute('aria-disabled', 'true');
      });

      it('selects a disabled option with the arrow keys', () => {
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
      });

      describe('selecting a disabled option', () => {
        describe('when clicking on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.click(getAllByRole('option')[1]);
            expect(spy).not.toHaveBeenCalled();
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('when pressing enter on an option', () => {
          it('does not close the listbox or select the item', () => {
            const spy = jest.fn();
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} onValue={spy} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(spy).not.toHaveBeenCalled();
            expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          });
        });

        describe('when bluring the listbox', () => {
          it('closes the listbox without selecting the item', async () => {
            const spy = jest.fn();
            const { getByRole } = render((
              <>
                <ComboBoxWrapper options={options} onValue={spy} />
                <input />
              </>
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            userEvent.tab();
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
          <ComboBoxWrapper options={options} value={2} onValue={spy} />,
        );
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
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
          <ComboBoxWrapper options={options} value={2} onValue={spy} />,
        );
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'foo', id: 3 });
      });
    });

    describe('html', () => {
      it('sets attributes on the option', () => {
        const options = [{ label: 'foo', html: { 'data-foo': 'bar', className: 'class' } }];
        const { getByRole } = render(
          <ComboBoxWrapper options={options} />,
        );
        getByRole('combobox').focus();
        expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
        expect(getByRole('option')).toHaveAttribute('class', 'class');
      });

      describe('html id', () => {
        it('is used as the options id', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }];
          const { getByRole } = render(
            <ComboBoxWrapper options={options} />,
          );
          getByRole('combobox').focus();
          expect(getByRole('option')).toHaveAttribute('id', 'xxx');
        });

        it('will not use duplicate ids', () => {
          const options = [{ label: 'foo', html: { id: 'xxx' } }, { label: 'bar', html: { id: 'xxx' } }];
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={options} />,
          );
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
          expect(getAllByRole('option')[0]).toHaveAttribute('id', 'xxx');
          expect(getAllByRole('option')[1]).toHaveAttribute('id', 'xxx_1');
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
        const { container } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
      });

      it('does not select a group with the arrow keys', () => {
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        expect(getAllByRole('option')[1]).toHaveTextContent('Orange');
      });

      it('triggers onValue when an option is selected', () => {
        const spy = jest.fn();
        const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenCalledWith({ label: 'Orange', group: 'Citrus' });
      });

      it('updates the selected option', () => {
        const { getByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(getByRole('combobox')).toHaveValue('Orange');
      });

      describe('when clicking on a group', () => {
        it('does not close the listbox or select the item', () => {
          const spy = jest.fn();
          const { getByRole, getAllByText } = render(
            <ComboBoxWrapper options={options} onValue={spy} />,
          );
          getByRole('combobox').focus();
          fireEvent.click(getAllByText('Citrus')[0]);
          expect(spy).not.toHaveBeenCalled();
          expectToBeOpen(getByRole('combobox'));
        });
      });
    });

    describe('other attributes', () => {
      it('does not render them', () => {
        const options = [{ label: 'foo', 'data-foo': 'bar' }];
        const { getByRole } = render(<ComboBoxWrapper options={options} />);
        getByRole('combobox').focus();
        expect(getByRole('option')).not.toHaveAttribute('data-foo', 'bar');
      });
    });
  });

  describe('options as array of strings', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('renders a closed combo box', () => {
      const { container } = render(<ComboBoxWrapper options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('Banana');
      expectToBeClosed(getByRole('combobox'));
    });

    it('can select an empty string', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={['']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith('');
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('options as array of numbers', () => {
    const options = [1, 2, 3];

    it('renders a closed combo box', () => {
      const { container } = render(<ComboBoxWrapper options={options} />);
      expect(container).toMatchSnapshot();
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={options} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(2);
      expectToBeClosed(getByRole('combobox'));
    });

    it('can select 0', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[0]} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(0);
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('options as null', () => {
    it('renders an option with an empty string', () => {
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper options={[null, 'foo']} />);
      expect(container).toMatchSnapshot();
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      expect(getAllByRole('option')[0]).toHaveTextContent('');
      expect(getAllByRole('option')[0]).not.toHaveTextContent('null');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[null, 'foo']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(null);
      expectToBeClosed(getByRole('combobox'));
      expect(document.activeElement).toEqual(getByRole('combobox'));
    });
  });

  describe('options as undefined', () => {
    it('renders an option with an empty string', () => {
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper options={[undefined, 'foo']} />);
      expect(container).toMatchSnapshot();
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      expect(getAllByRole('option')[0]).toHaveTextContent('');
      expect(getAllByRole('option')[0]).not.toHaveTextContent('undefined');
    });

    it('triggers the onValue callback with the selected value', () => {
      const spy = jest.fn();
      const { getByRole } = render(<ComboBoxWrapper options={[undefined, 'foo']} onValue={spy} />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      expect(spy).toHaveBeenCalledWith(undefined);
      expectToBeClosed(getByRole('combobox'));
      expect(document.activeElement).toEqual(getByRole('combobox'));
    });
  });

  describe('no options', () => {
    it('does not open the listbox on focus', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToBeClosed(getByRole('combobox'));
    });

    it('does not open the listbox on alt + arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('mapOption', () => {
    const options = [{ name: 'Apple' }, { name: 'Banana' }, { name: 'Orange' }];

    it('maps options', () => {
      const spy = jest.fn();
      const { getByRole, getByText } = render(<ComboBoxWrapper
        options={options}
        onValue={spy}
        mapOption={({ name }) => ({ label: name })}
      />);
      getByRole('combobox').focus();
      fireEvent.click(getByText('Orange'));
      expect(spy).toHaveBeenCalledWith({ name: 'Orange' });
    });

    it('selects a mapped option', () => {
      const { getByRole, getByText } = render(<ComboBoxWrapper
        options={options}
        mapOption={({ name }) => ({ label: name })}
      />);
      getByRole('combobox').focus();
      fireEvent.click(getByText('Orange'));
      expect(getByRole('combobox')).toHaveValue('Orange');
    });
  });
});

describe('value', () => {
  it('sets the initial selected option', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const { getAllByRole, getByRole } = render((
      <ComboBoxWrapper options={options} value="Banana" />
    ));
    getByRole('combobox').focus();
    expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
  });

  it('sets the combo box value', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const { getByRole } = render((
      <ComboBoxWrapper options={options} value="Banana" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveValue('Banana');
  });

  describe('with a single option matching the value', () => {
    it('does not open the combo box', () => {
      const options = [{ id: 1 }];
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value={1} />
      ));
      getByRole('combobox').focus();
      expectToBeClosed(getByRole('combobox'));
    });
  });

  describe('value is disabled', () => {
    it('selects the disabled option', () => {
      const options = [{ label: 'Apple', disabled: true }, 'Banana'];
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" />
      ));
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });
  });

  describe('value is not in options', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not select a value', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Strawberry" />
      ));
      getByRole('combobox').focus();
      expectToBeOpen(getByRole('combobox'));
    });

    it('displays value as the combo box label', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Strawberry" />
      ));
      expect(getByRole('combobox')).toHaveValue('Strawberry');
    });
  });

  describe('updating the value', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not update the aria-selected value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
        value="Orange"
      />);
      getByRole('combobox').focus();
      propUpdater.update((props) => ({ ...props, value: 'Apple' }));
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
    });

    it('does not change the focused value of an open listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      propUpdater.update((props) => ({ ...props, value: 'Banana' }));
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
    });

    it('changes the value of a closed listbox', () => {
      const propUpdater = new PropUpdater();
      const { getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      fireEvent.keyDown(document.activeElement, { key: 'Enter' });
      propUpdater.update((props) => ({ ...props, value: 'Banana' }));
      expect(document.activeElement).toHaveValue('Banana');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });
  });
});

describe('busy', () => {
  describe('busyDebounce is null', () => {
    describe('when false', () => {
      it('sets aria-busy=false on the wrapper', () => {
        const { container } = render((
          <ComboBoxWrapper options={['foo']} busyDebounce={null} />
        ));
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
      });
    });

    describe('when true', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy busyDebounce={null} />
          ));
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=true on the wrapper', () => {
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} busy busyDebounce={null} />
          ));
          getByRole('combobox').focus();
          userEvent.type(getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
        });
      });

      describe('with a search matching the current value', () => {
        it('does not set aria-busy', () => {
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} value="foo" busy busyDebounce={null} />
          ));
          getByRole('combobox').focus();
          fireEvent.change(document.activeElement, { target: { value: 'foo' } });
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });

    describe('when null', () => {
      describe('with no search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container } = render((
            <ComboBoxWrapper options={['foo']} busy={null} busyDebounce={null} />
          ));
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });

      describe('with a search', () => {
        it('sets aria-busy=false on the wrapper', () => {
          const { container, getByRole } = render((
            <ComboBoxWrapper options={['foo']} busy={null} busyDebounce={null} />
          ));
          getByRole('combobox').focus();
          userEvent.type(getByRole('combobox'), 'foo');
          expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        });
      });
    });
  });

  describe('busyDebounce is the default', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after 200ms', () => {
        jest.useFakeTimers();
        const { container, getByRole } = render((
          <ComboBoxWrapper options={['foo']} busy />
        ));
        getByRole('combobox').focus();
        userEvent.type(getByRole('combobox'), 'foo');
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(200);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
      });
    });
  });

  describe('busyDebounce is custom', () => {
    describe('when true', () => {
      it('sets aria-busy=true on the wrapper after delay', () => {
        jest.useFakeTimers();
        const { container, getByRole } = render((
          <ComboBoxWrapper options={['foo']} busy busyDebounce={500} />
        ));
        getByRole('combobox').focus();
        userEvent.type(getByRole('combobox'), 'foo');
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(499);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'false');
        act(() => {
          jest.advanceTimersByTime(1);
        });
        expect(container.firstChild).toHaveAttribute('aria-busy', 'true');
      });
    });
  });
});

describe('onSearch', () => {
  describe('without onSearch', () => {
    it('sets aria-autocomplete to none', () => {
      const { getByRole } = render(<ComboBoxWrapper options={['foo']} />);
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });
  });

  describe('when provided', () => {
    it('sets aria-autocomplete to list', () => {
      const { getByRole } = render(<ComboBoxWrapper options={['foo']} onSearch={() => {}} />);
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('on focus', () => {
      it('calls onSearch without a value', () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} />
        ));
        getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('');
      });

      it('calls onSearch with a value', () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} value="foo" />
        ));
        getByRole('combobox').focus();
        expect(spy).toHaveBeenCalledWith('foo');
      });
    });

    describe('typing', () => {
      it('calls onSearch', async () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onSearch={spy} />
        ));
        getByRole('combobox').focus();
        await userEvent.type(getByRole('combobox'), 'foo');
        expect(spy.mock.calls).toEqual([
          [''],
          ['f'],
          ['fo'],
          ['foo'],
        ]);
      });
    });

    describe('on selecting a value', () => {
      it('calls onSearch', () => {
        const spy = jest.fn();
        const { getByRole } = render((
          <ComboBoxWrapper options={['foo']} onValue={spy} />
        ));
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expect(spy).toHaveBeenLastCalledWith('foo');
      });
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];
    const otherNewOptions = ['Peach', 'Kiwi', 'Grape'];

    it('updates the displayed options', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole, getAllByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      getByRole('combobox').focus();
      propUpdater.update((props) => ({ ...props, options: newOptions }));
      expect(container).toMatchSnapshot();
      expect(getAllByRole('option').map((o) => o.textContent)).toEqual([
        'Strawberry',
        'Raspberry',
        'Banana',
      ]);
    });

    describe('update contains the focused option', () => {
      it('keeps the currently focused option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the focused option', () => {
      it('removes the focused option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
        expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: otherNewOptions }));
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          value="Banana"
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: newOptions }));
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
      });
    });

    describe('update does not contain the selected option', () => {
      it('removes the selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
          options={options}
          value="Banana"
          propUpdater={propUpdater}
        />);
        getByRole('combobox').focus();
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
        propUpdater.update((props) => ({ ...props, options: otherNewOptions }));
        expectToBeOpen(getByRole('combobox'));
      });
    });
  });
});

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(document.activeElement).toEqual(comboBox);
      expect(comboBox).toHaveAttribute('aria-activedescendant', getAllByRole('option')[1].id);
      expect(getAllByRole('option')[1]).toHaveAttribute('aria-selected', 'true');
    });

    it('allows an option to be selected', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} managedFocus={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'Enter' });
      expect(document.activeElement).toEqual(comboBox);
      expectToBeClosed(getByRole('combobox'));
      expect(comboBox).toHaveValue('Apple');
    });
  });
});

describe('showSelectedLabel', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('by default', () => {
    it('does not show the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when false', () => {
    it('does not show the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel={false} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });
  });

  describe('when true', () => {
    it('shows the selected option label in the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the selected option label in the input after typing', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('Apple');
    });

    it('shows the original search when returning to the input', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      userEvent.type(document.activeElement, 'a');
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      fireEvent.keyDown(comboBox, { key: 'ArrowUp' });
      expect(comboBox).toHaveValue('a');
    });

    it('does not show the label of a disabled option', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[{ disabled: true, label: 'foo' }]} showSelectedLabel />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(comboBox).toHaveValue('');
    });

    it('does not trigger a search when moving through options', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <ComboBoxWrapper options={options} showSelectedLabel onSearch={spy} />,
      );
      const comboBox = getByRole('combobox');
      comboBox.focus();
      spy.mockClear();
      fireEvent.keyDown(comboBox, { key: 'ArrowDown' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('autoselect', () => {
  describe('when true', () => {
    it('does not change the value of aria-autocomplete for no onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'none');
    });

    it('does not change the value of aria-autocomplete for an onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect onSearch={() => {}} />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('when typing', () => {
      it('auto selects the first matching option', async () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      });

      it('auto selects the first non-disabled option', async () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={[{ disabled: true, label: 'frog' }, 'foo']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'f');
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[1]);
      });

      it('does not auto select no matching option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foc', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'c');
        expectToBeOpen(getByRole('combobox'));
      });

      it('does not auto select later matching options', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'b');
        expectToBeOpen(getByRole('combobox'));
      });
    });

    describe('backspace', () => {
      it('does not auto-select an option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'fo');
        fireEvent.keyDown(getByRole('combobox'), { key: 'Backspace' });
        expectToBeOpen(getByRole('combobox'));
      });

      describe('ctrl+d', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
            const { getByRole } = render(
              <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'fo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'd', ctrlKey: true });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['food', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'd', ctrlKey: true });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });
    });

    describe('delete', () => {
      it('does not auto-select an option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
        );
        getByRole('combobox').focus();
        await userEvent.type(document.activeElement, 'foo');
        fireEvent.keyDown(getByRole('combobox'), { key: 'Delete' });
        fireEvent.change(getByRole('combobox'), { target: { value: 'foo' } });
        expectToBeOpen(getByRole('combobox'));
      });

      describe('ctrl+h', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
            const { getByRole } = render(
              <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'h', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fo' } });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['fooh', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'h', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fooh' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('ctrl+k', () => {
        describe('on a mac', () => {
          it('does not auto-select an option', async () => {
            jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
            const { getByRole } = render(
              <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'fo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'k', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fo' } });
            expectToBeOpen(getByRole('combobox'));
          });
        });

        describe('on other systems', () => {
          it('continues to auto-select an option', async () => {
            const { getByRole, getAllByRole } = render(
              <ComboBoxWrapper options={['fook', 'bar']} autoselect />,
            );
            getByRole('combobox').focus();
            await userEvent.type(document.activeElement, 'foo');
            fireEvent.keyDown(getByRole('combobox'), { key: 'k', ctrlKey: true });
            fireEvent.change(getByRole('combobox'), { target: { value: 'fok' } });
            expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          });
        });
      });

      describe('selecting options', () => {
        it('allows other options to be selected', async () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'bar']} autoselect />,
          );
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'foo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('updates to options', () => {
        it('autoselects a new value if no value is autoselected', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'ba');
          expectToBeOpen(getByRole('combobox'));
          propUpdater.update((props) => ({ ...props, options: ['bar', 'foo'] }));
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });

        it('autoselects a new value if a value is autoselected', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          propUpdater.update((props) => ({ ...props, options: ['food', 'bard'] }));
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
        });

        it('removes the autoselect if there is no matching value', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
          propUpdater.update((props) => ({ ...props, options: ['bar', 'foo'] }));
          expectToBeOpen(getByRole('combobox'));
        });

        it('does not autoselect if a different value is focused', async () => {
          const propUpdater = new PropUpdater();
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper
            options={['foo', 'bar']}
            autoselect
            propUpdater={propUpdater}
          />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          propUpdater.update((props) => ({ ...props, options: ['food', 'bar'] }));
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
        });
      });

      describe('on blur', () => {
        it('selects the autoselected value', async () => {
          const spy = jest.fn();
          const { getByRole } = render((
            <>
              <ComboBoxWrapper options={['foo']} autoselect onValue={spy} />
              <input />
            </>
          ));
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'fo');
          userEvent.tab();
          await wait(() => {
            expect(spy).toHaveBeenCalledWith('foo');
          });
        });
      });
    });
  });

  describe('when inline', () => {
    it('changes the value of aria-autocomplete for no onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect="inline" />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'inline');
    });

    it('changes the value of aria-autocomplete for an onSearch', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['foo']} autoselect="inline" onSearch={() => {}} />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'both');
    });

    describe('when typing', () => {
      it('selects the text of the autoselected option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 1);
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.change(document.activeElement, { target: { value: 'f', selectionStart: 1 } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));
        expect(document.activeElement).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(1, 3, 'backwards');
      });

      it('does not select the text of a disabled option', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={[{ disabled: 'foo' }]} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 1);
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.change(document.activeElement, { target: { value: 'f', selectionStart: 1 } });
        expectToBeOpen(getByRole('combobox'));
        expect(document.activeElement).toHaveValue('f');
        expect(spy).not.toHaveBeenCalled();
      });

      it('does not select the text if the cursor position is inappropriate', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 1);
        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 1 } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));
        expect(document.activeElement).toHaveValue('fo');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text and last character on backspace', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.keyDown(document.activeElement, { key: 'Backspace' });
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToBeOpen(getByRole('combobox'));
        expect(document.activeElement).toHaveValue('f');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text on delete', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.keyDown(document.activeElement, { key: 'Delete' });
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToBeOpen(getByRole('combobox'));
        expect(document.activeElement).toHaveValue('fo');
        expect(spy).not.toHaveBeenCalled();
      });

      it('removes the autoselected text on escape', async () => {
        const { getByRole } = render(
          <ComboBoxWrapper options={['foo']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToHaveSelectedOption(getByRole('combobox'), getByRole('option'));

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.keyDown(document.activeElement, { key: 'Escape' });
        expectToBeClosed(getByRole('combobox'));
        expect(document.activeElement).toHaveValue('');
        expect(spy).not.toHaveBeenCalled();
      });
    });

    describe('moving between options', () => {
      describe('when showSelectedLabel is unset', () => {
        it('updates the value to the selected label', async () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />,
          );
          getByRole('combobox').focus();
          // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
          jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
          fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          expect(getByRole('combobox')).toHaveValue('foe');
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('when showSelectedLabel is true', () => {
        it('updates the value to the selected label', () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel />,
          );
          getByRole('combobox').focus();
          // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
          jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
          fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          expect(getByRole('combobox')).toHaveValue('foe');
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('when showSelectedLabel is false', () => {
        it('does not update the value to the selected label', () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" showSelectedLabel={false} />,
          );
          getByRole('combobox').focus();
          // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
          jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
          fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
          expect(getByRole('combobox')).toHaveValue('fo');
          expect(spy).not.toHaveBeenCalled();
        });
      });

      describe('when returning to the original option', () => {
        it('it sets the search string without selecting the text', () => {
          const { getByRole, getAllByRole } = render(
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />,
          );
          getByRole('combobox').focus();
          // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
          jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
          fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
          expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

          const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expectToBeOpen(getByRole('combobox'));
          expect(getByRole('combobox')).toHaveValue('fo');
          expect(spy).not.toHaveBeenCalled();
        });
      });
    });

    describe('selecting an option', () => {
      it('removes the text selection', () => {
        const { getByRole, getAllByRole } = render(
          <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />,
        );
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        fireEvent.keyDown(document.activeElement, { key: 'Enter' });
        expectToBeClosed(getByRole('combobox'));
        expect(getByRole('combobox')).toHaveValue('foo');
        expect(spy).toHaveBeenCalledWith(3, 3, 'forward');
      });

      it('does not change the selection without focus', async () => {
        const { getByRole, getAllByRole } = render((
          <>
            <ComboBoxWrapper options={['foo', 'foe']} autoselect="inline" />
            <input />
          </>
        ));
        getByRole('combobox').focus();
        // Possible jsdom bug messing this up https://github.com/testing-library/react-testing-library/issues/247
        jest.spyOn(document.activeElement, 'selectionStart', 'get').mockImplementation(() => 2);
        fireEvent.change(document.activeElement, { target: { value: 'fo', selectionStart: 2 } });
        expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);

        const spy = jest.spyOn(document.activeElement, 'setSelectionRange');
        userEvent.tab();
        await wait(() => {
          expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
        });
        expect(getByRole('combobox')).toHaveValue('foo');
        expect(spy).not.toHaveBeenCalled();
      });
    });
  });
});

describe('tabAutocomplete', () => {
  describe('when autoselect is false', () => {
    it('pressing tab does not select the item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('when autoselect is true', () => {
    it('pressing tab selects an autocomplete item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).toHaveBeenCalledWith('foo');
    });

    it('pressing shift+tab does not select an autocomplete item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', shiftKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing alt+tab does not select an autocomplete item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', altKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing ctrl+tab does not select an autocomplete item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', ctrlKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing meta+tab does not select an autocomplete item', async () => {
      const spy = jest.fn();
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'fo');
      fireEvent.keyDown(document.activeElement, { key: 'Tab', metaKey: true });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not select a focused item', async () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });

    it('pressing tab does not reselect the current item', async () => {
      const spy = jest.fn();
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={['foo', 'foe']} autoselect tabAutocomplete onValue={spy} value="foo" />
      ));
      getByRole('combobox').focus();
      expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[0]);
      fireEvent.keyDown(document.activeElement, { key: 'Tab' });
      expect(spy).not.toHaveBeenCalled();
    });
  });
});

describe('findAutoselect', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('skips options by returning null', async () => {
    const findAutoselect = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return null;
      }
      return true;
    });
    const { getByRole, getAllByRole } = render((
      <ComboBoxWrapper options={options} autoselect findAutoselect={findAutoselect} />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToHaveSelectedOption(getByRole('combobox'), getAllByRole('option')[2]);
    expect(findAutoselect.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'o'],
      [expect.objectContaining({ value: 'Pear' }), 'o'],
      [expect.objectContaining({ value: 'Orange' }), 'o'],
    ]);
  });

  it('ends the search by returning false', async () => {
    const findAutoselect = jest.fn((option) => {
      if (option.label !== 'Orange') {
        return false;
      }
      return true;
    });
    const { getByRole } = render((
      <ComboBoxWrapper options={options} autoselect findAutoselect={findAutoselect} />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'o');
    expectToBeOpen(getByRole('combobox'));
    expect(findAutoselect.mock.calls).toEqual([
      [expect.objectContaining({ value: 'Apple' }), 'o'],
    ]);
  });
});

describe('notFoundMessage', () => {
  describe('by default', () => {
    it('displays not found if search returns no results', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectToHaveNotFoundMessage(document.activeElement, 'No matches found');
    });

    it('does not display a not found if busy', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} busy />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if busy is null', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} busy={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if there is no search', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if the list box is closed', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
      expectNotToHaveNotFoundMessage(document.activeElement);
    });

    it('does not display a not found if the search term matches the current option', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} value="foo" />
      ));
      getByRole('combobox').focus();
      expectNotToHaveNotFoundMessage(document.activeElement);
    });
  });

  describe('with custom message', () => {
    it('displays custom not found if search returns no results', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={<b>custom message</b>} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectToHaveNotFoundMessage(document.activeElement, 'custom message');
    });
  });

  describe('when null', () => {
    it('does not disabled a not found message when no results are found', async () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[]} notFoundMessage={null} />
      ));
      getByRole('combobox').focus();
      await userEvent.type(document.activeElement, 'foo');
      expectNotToHaveNotFoundMessage(document.activeElement);
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
      <ComboBoxWrapper options={options} id="foo" />,
    );
    getByRole('combobox').focus();
    expect(container.querySelector('div')).not.toHaveAttribute('id');
    expect(getByRole('combobox')).toHaveAttribute('id', 'foo');
    expect(getByRole('listbox')).toHaveAttribute('id', 'foo_listbox');
    expect(getAllByRole('option')[0]).toHaveAttribute('id', 'foo_option_apple');
    expect(getAllByRole('option')[1]).toHaveAttribute('id', 'foo_option_pear');
    expect(getAllByRole('option')[2]).toHaveAttribute('id', 'foo_option_orange');

    expect(document.getElementById('foo_clear_button')).toBeInstanceOf(Element);
    expect(document.getElementById('foo_not_found')).toBeInstanceOf(Element);
  });
});

describe('skipOption', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('allows options to be skipped moving forward', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[2]);
  });

  it('allows options to be skipped moving backwards', () => {
    function skipOption(option) {
      return option.label === 'Pear';
    }
    const { getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
    expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[0]);
  });

  describe('on a mac', () => {
    it('allows options to be skipped pressing home', () => {
      jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
      function skipOption(option) {
        return option.label === 'Apple';
      }
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'Home' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });

    it('allows options to be skipped pressing end', () => {
      jest.spyOn(navigator, 'platform', 'get').mockImplementation(() => 'MacIntel');
      function skipOption(option) {
        return option.label === 'Orange';
      }
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} skipOption={skipOption} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'End' });
      expectToHaveFocusedOption(getByRole('combobox'), getAllByRole('option')[1]);
    });
  });
});

describe('onChange', () => {
  const options = ['Apple', 'Pear', 'Orange'];

  it('triggers on typing', async () => {
    const spy = jest.fn((e) => e.persist());
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onChange={spy} />,
    );
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      type: 'change',
      target: expect.objectContaining({
        value: 'foo',
        nodeName: 'INPUT',
      }),
    }));
  });

  it('does not trigger when a value is selected', async () => {
    const spy = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} onChange={spy} />,
    );
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    fireEvent.keyDown(document.activeElement, { key: 'Enter' });
    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: 'Apple',
        nodeName: 'INPUT',
      }),
    }));
  });

  it('triggers when a value is removed', async () => {
    const spy = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} value="Apple" onChange={spy} />,
    );
    getByRole('combobox').focus();
    userEvent.click(document.getElementById(`${getByRole('combobox').id}_clear_button`));

    expect(spy).toHaveBeenCalledWith(expect.objectContaining({
      target: expect.objectContaining({
        value: '',
        nodeName: 'INPUT',
      }),
    }));
  });
});

describe('onBlur', () => {
  it('is called when the input is blurred', async () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <>
        <ComboBoxWrapper options={['foo']} onBlur={spy} />
        <input />
      </>
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    expect(spy).not.toHaveBeenCalled();
    userEvent.tab();

    await wait(() => {
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});

describe('onFocus', () => {
  it('is called when the input is focused', async () => {
    const spy = jest.fn();
    const { getByRole } = render((
      <>
        <ComboBoxWrapper options={['foo']} onFocus={spy} />
        <input />
      </>
    ));
    getByRole('combobox').focus();
    expect(spy).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
    userEvent.tab();
    expect(spy).toHaveBeenCalledTimes(1);
  });
});

describe('aria-describedby', () => {
  it('is appended to the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} aria-describedby="foo" />
    ));
    getByRole('combobox').focus();
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'foo');
  });

  it('is appended to the input when not found is showing', async () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={[]} aria-describedby="foo" />
    ));
    getByRole('combobox').focus();
    await userEvent.type(document.activeElement, 'foo');
    expect(getByRole('combobox')).toHaveAttribute('aria-describedby', 'id_not_found foo');
  });
});

['disabled', 'readOnly', 'required'].forEach((name) => {
  describe(name, () => {
    it('is added to the input', () => {
      const props = { [name]: true };
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} {...props} />
      ));
      expect(getByRole('combobox')).toHaveAttribute(name);
    });
  });
});

[
  'autoCapitalize', 'inputMode',
  'maxLength', 'minLength', 'pattern', 'placeholder',
  'spellCheck',
].forEach((name) => {
  describe(name, () => {
    it('is added to the input', () => {
      const props = { [name]: 'foo' };
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} {...props} />
      ));
      expect(getByRole('combobox')).toHaveAttribute(name, 'foo');
    });
  });
});

describe('size', () => {
  it('is added to the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} size={2} />
    ));
    expect(getByRole('combobox')).toHaveAttribute('size', '2');
  });
});

describe('data-*', () => {
  it('is added to the input', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} data-foo="bar" />
    ));
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ref', () => {
  it('references the input for an object ref', () => {
    const ref = { current: null };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(ref.current).toEqual(getByRole('combobox'));
  });

  it('references the input for a function ref', () => {
    let value;
    const ref = (node) => {
      value = node;
    };
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} ref={ref} />
    ));
    expect(value).toEqual(getByRole('combobox'));
  });
});

describe('WrapperComponent', () => {
  it('allows the wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={['foo']} WrapperComponent="dl" />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
  });

  it('allows access to the context', () => {
    const spy = jest.fn();

    const WrapperComponent = forwardRef((props, ref) => {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} ref={ref} />
      );
    });

    render(
      <ComboBoxWrapper foo="bar" options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        inlineAutoselect: false,
        focusedOption: null,
        search: null,
        expanded: false,
        focusListBox: false,
      },
      props: expect.objectContaining({
        foo: 'bar',
        options: expect.any(Array),
        value: null,
      }),
    });
  });

  it('allows custom layouts', () => {
    const WrapperComponent = forwardRef((props, ref) => {
      const { children: [comboBox, clearButton, listBox, notFound] } = props;

      return (
        <div {...props} ref={ref}>
          <div className="combobox-wrapper">
            {comboBox}
          </div>
          <div className="clear-button-wrapper">
            {clearButton}
          </div>
          <div className="listbox-wrapper">
            {listBox}
          </div>
          <div className="not-found-wrapper">
            {notFound}
          </div>
        </div>
      );
    });

    const { container } = render(
      <ComboBoxWrapper options={['foo']} WrapperComponent={WrapperComponent} />,
    );

    expect(container).toMatchSnapshot();
  });
});

describe('wrapperProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { container } = render(
      <ComboBoxWrapper options={['foo']} wrapperProps={{ 'data-foo': 'bar' }} />,
    );
    expect(container.firstChild).toHaveAttribute('data-foo', 'bar');
  });
});

describe('InputComponent', () => {
  it('allows the input to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} InputComponent="dl" />,
    );
    expect(getByRole('combobox').tagName).toEqual('DL');
  });
});

describe('inputProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} inputProps={{ 'data-foo': 'bar' }} />,
    );
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ListBoxComponent', () => {
  it('allows the listbox to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} ListBoxComponent="dl" />,
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
      <ComboBoxWrapper foo="bar" options={['foo']} ListBoxComponent={ListBoxComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        inlineAutoselect: false,
        focusedOption: null,
        search: null,
        expanded: false,
        focusListBox: false,
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
      <ComboBoxWrapper options={['foo']} listBoxProps={{ 'data-foo': 'bar' }} />,
    );
    expect(getByRole('listbox', { hidden: true })).toHaveAttribute('data-foo', 'bar');
  });
});

describe('GroupComponent', () => {
  it('allows the group wrapper to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} GroupComponent="dl" />,
    );
    expect(container.querySelector('dl').firstChild).toHaveClass('combobox__group');
  });

  it('allows access to the context with group properties', () => {
    const spy = jest.fn();

    function GroupComponent(props) {
      const context = useContext(Context);
      spy(context);
      return (
        <div {...props} />
      );
    }

    render(
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} GroupComponent={GroupComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        inlineAutoselect: false,
        focusedOption: null,
        search: null,
        expanded: false,
        focusListBox: false,
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

describe('groupProps', () => {
  it('allows custom props', () => {
    const { container } = render(
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupComponent="dl"
        groupProps={{ 'data-foo': 'bar' }}
      />,
    );
    expect(container.querySelector('dl')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('GroupLabelComponent', () => {
  it('allows the group to be replaced', () => {
    const { container } = render(
      <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} GroupLabelComponent="dl" />,
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
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} GroupLabelComponent={GroupLabelComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        inlineAutoselect: false,
        focusedOption: null,
        search: null,
        expanded: false,
        focusListBox: false,
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
      <ComboBoxWrapper
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
      <ComboBoxWrapper options={['foo']} OptionComponent="dl" />,
    );
    getByRole('combobox').focus();
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
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} OptionComponent={OptionComponent} />,
    );

    expect(spy).toHaveBeenCalledWith({
      state: {
        inlineAutoselect: false,
        focusedOption: null,
        search: null,
        expanded: false,
        focusListBox: false,
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
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        optionProps={{ 'data-foo': 'bar' }}
      />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option')).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ValueComponent', () => {
  it('allows the component to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} ValueComponent="dl" />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
  });
});

describe('valueProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <ComboBoxWrapper
        options={['foo']}
        valueProps={{ 'data-foo': 'bar' }}
        ValueComponent="div"
      />,
    );
    getByRole('combobox').focus();
    expect(getByRole('option').firstChild).toHaveAttribute('data-foo', 'bar');
  });
});

describe('ClearButtonComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} ClearButtonComponent="dl" />,
    );
    const button = document.getElementById('id_clear_button');
    expect(button.tagName).toEqual('DL');
  });
});

describe('clearButtonProps', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper options={['foo']} clearButtonProps={{ 'data-foo': 'bar' }} />,
    );
    const button = document.getElementById('id_clear_button');
    expect(button).toHaveAttribute('data-foo', 'bar');
  });
});

describe('NotFoundComponent', () => {
  it('allows the component to be replaced', () => {
    render(
      <ComboBoxWrapper options={['foo']} NotFoundComponent="dl" />,
    );
    const el = document.getElementById('id_not_found');
    expect(el.tagName).toEqual('DL');
  });
});

describe('notFoundProps', () => {
  it('allows custom props', () => {
    render(
      <ComboBoxWrapper options={['foo']} notFoundProps={{ 'data-foo': 'bar' }} />,
    );
    const el = document.getElementById('id_not_found');
    expect(el).toHaveAttribute('data-foo', 'bar');
  });
});

describe('layoutListBox', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  it('is called when the listbox is displayed', () => {
    const layoutListBox = jest.fn();
    const { getByRole } = render(
      <ComboBoxWrapper options={options} layoutListBox={layoutListBox} />,
    );
    expect(layoutListBox).not.toHaveBeenCalled();
    getByRole('combobox').focus();
    expect(layoutListBox).toHaveBeenCalledWith({
      listBox: getByRole('listbox'),
      comboBox: getByRole('combobox'),
      option: undefined,
    });
  });

  it('is called when the listbox options change', () => {
    const propUpdater = new PropUpdater();
    const layoutListBox = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
        propUpdater={propUpdater}
      />
    ));
    getByRole('combobox').focus();
    propUpdater.update((props) => ({ ...props, options: ['strawberry'] }));
    expect(layoutListBox).toHaveBeenCalledTimes(2);
    expect(layoutListBox).toHaveBeenLastCalledWith({
      listBox: getByRole('listbox'),
      comboBox: getByRole('combobox'),
      option: undefined,
    });
  });

  it('is called when the selected option changes', () => {
    const layoutListBox = jest.fn();
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    getByRole('combobox').focus();
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
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    getByRole('combobox').focus();
    fireEvent.keyDown(document.activeElement, { key: 'Escape' });
    expect(layoutListBox).toHaveBeenCalledTimes(1);
  });

  it('sets the list box style and classes', () => {
    const layoutListBox = jest.fn(() => ({ style: { color: 'red' }, className: 'foo' }));
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    getByRole('combobox').focus();
    expect(getByRole('listbox')).toHaveStyle('color: red');
    expect(getByRole('listbox')).toHaveAttribute('class', 'combobox__listbox foo');
  });

  it('sets styles and classes to null if not supplied', () => {
    const layoutListBox = jest.fn(() => ({}));
    const { getByRole } = render((
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    getByRole('combobox').focus();
    expect(getByRole('listbox')).not.toHaveAttribute('style');
    expect(getByRole('listbox')).toHaveAttribute('class', 'combobox__listbox');
  });
});

describe('classNames', () => {
  describe('wrapper', () => {
    it('is combobox by default', () => {
      const { container } = render((
        <ComboBoxWrapper options={['foo']} />
      ));
      expect(container.firstChild).toHaveAttribute('class', 'combobox');
    });

    it('is combobox if not supplied in classes', () => {
      const { container } = render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      expect(container.firstChild).toHaveAttribute('class', 'combobox');
    });

    it('can be customised by classes', () => {
      const { container } = render((
        <ComboBoxWrapper options={['foo']} classNames={{ wrapper: 'foo' }} />
      ));
      expect(container.firstChild).toHaveAttribute('class', 'foo');
    });
  });

  describe('input', () => {
    it('is combobox__input by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} />
      ));
      expect(getByRole('combobox')).toHaveAttribute('class', 'combobox__input');
    });

    it('is combobox__input if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      expect(getByRole('combobox')).toHaveAttribute('class', 'combobox__input');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{ input: 'foo' }} />
      ));
      expect(getByRole('combobox')).toHaveAttribute('class', 'foo');
    });
  });

  describe('listbox', () => {
    it('is combobox__listbox by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} />
      ));
      expect(getByRole('listbox', { hidden: true })).toHaveAttribute('class', 'combobox__listbox');
    });

    it('is combobox__listbox if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      expect(getByRole('listbox', { hidden: true })).toHaveAttribute('class', 'combobox__listbox');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{ listbox: 'foo' }} />
      ));
      expect(getByRole('listbox', { hidden: true })).toHaveAttribute('class', 'foo');
    });
  });

  describe('groupLabel', () => {
    it('is combobox__group by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} />
      ));
      expect(getByRole('option', { hidden: true }).previousSibling).toHaveAttribute('class', 'combobox__group');
    });

    it('is combobox__group if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{}} />
      ));
      expect(getByRole('option', { hidden: true }).previousSibling).toHaveAttribute('class', 'combobox__group');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{ groupLabel: 'foo' }} />
      ));
      expect(getByRole('option', { hidden: true }).previousSibling).toHaveAttribute('class', 'foo');
    });
  });

  describe('option', () => {
    it('is combobox__option by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option');
    });

    it('is combobox__group if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{ option: 'foo' }} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'foo');
    });
  });

  describe('optionSelected', () => {
    it('is combobox__option by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option')).toHaveAttribute('class', 'combobox__option');
    });

    it('is combobox__group if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option')).toHaveAttribute('class', 'combobox__option');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={['foo']} classNames={{ optionSelected: 'foo' }} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option')).toHaveAttribute('class', 'foo');
    });
  });

  describe('optionGrouped', () => {
    it('is combobox__option combobox__option--grouped by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option combobox__option--grouped');
    });

    it('is combobox__option combobox__option--grouped if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{}} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option combobox__option--grouped');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{ optionGrouped: 'foo' }} />
      ));
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'foo');
    });
  });

  describe('optionSelectedGrouped', () => {
    it('is combobox__option combobox__option--grouped by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option combobox__option--grouped');
    });

    it('is combobox__option combobox__option--grouped if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{}} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'combobox__option combobox__option--grouped');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{ optionSelectedGrouped: 'foo' }} />
      ));
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('option', { hidden: true })).toHaveAttribute('class', 'foo');
    });
  });

  describe('notFound', () => {
    it('is combobox__not-found by default', () => {
      render((
        <ComboBoxWrapper options={['foo']} />
      ));
      expect(document.getElementById('id_not_found')).toHaveAttribute('class', 'combobox__not-found');
    });

    it('is combobox__not-found if not supplied in classes', () => {
      render((
        <ComboBoxWrapper options={['foo']} classNames={{}} />
      ));
      expect(document.getElementById('id_not_found')).toHaveAttribute('class', 'combobox__not-found');
    });

    it('can be customised by classes', () => {
      render((
        <ComboBoxWrapper options={['foo']} classNames={{ notFound: 'foo' }} />
      ));
      expect(document.getElementById('id_not_found')).toHaveAttribute('class', 'foo');
    });
  });

  describe('clearButton', () => {
    it('is combobox__clear-button by default', () => {
      render((
        <ComboBoxWrapper options={['foo']} value="foo" />
      ));
      expect(document.getElementById('id_clear_button')).toHaveAttribute('class', 'combobox__clear-button');
    });

    it('is combobox__not-found if not supplied in classes', () => {
      render((
        <ComboBoxWrapper options={['foo']} value="foo" classNames={{}} />
      ));
      expect(document.getElementById('id_clear_button')).toHaveAttribute('class', 'combobox__clear-button');
    });

    it('can be customised by classes', () => {
      render((
        <ComboBoxWrapper options={['foo']} value="foo" classNames={{ clearButton: 'foo' }} />
      ));
      expect(document.getElementById('id_clear_button')).toHaveAttribute('class', 'foo');
    });
  });

  describe('visuallyHidden', () => {
    it('is visuallyhidden visually-hidden sr-only by default', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} />
      ));
      expect(getByRole('option', { hidden: true }).firstChild).toHaveAttribute('class', 'visually-hidden visuallyhidden sr-only');
    });

    it('is visuallyhidden visually-hidden sr-only if not supplied in classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{}} />
      ));
      expect(getByRole('option', { hidden: true }).firstChild).toHaveAttribute('class', 'visually-hidden visuallyhidden sr-only');
    });

    it('can be customised by classes', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={[{ label: 'foo', group: 'bar' }]} classNames={{ visuallyHidden: 'foo' }} />
      ));
      expect(getByRole('option', { hidden: true }).firstChild).toHaveAttribute('class', 'foo');
    });
  });
});

describe('other props', () => {
  it('are discarded', () => {
    const { getByRole } = render((
      <ComboBoxWrapper options={['foo']} foo="bar" />
    ));
    expect(getByRole('combobox')).not.toHaveAttribute('foo');
  });
});
