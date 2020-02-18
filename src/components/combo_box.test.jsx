import React, { Fragment, useState, useContext, forwardRef } from 'react';
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

function ComboBoxWrapper({ value: initialValue, propUpdater, ...props }) {
  const [value, onValue] = useState(initialValue);
  const [newProps, setProps] = useState(props);
  if (propUpdater) {
    propUpdater.setUpdater(setProps);
  }
  return (
    <ComboBox id="id" value={value} onValue={onValue} {...newProps} />
  );
}

expect.extend({
  toBeClosed(combobox) { // and focused
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
    if (!listbox.hidden) {
      return {
        pass: false,
        message: () => 'expected listbox to be hidden',
      };
    }
    if (combobox.getAttribute('aria-expanded') !== 'false') {
      return {
        pass: false,
        message: () => 'expected aria-expanded to be false',
      };
    }
    if (combobox.getAttribute('aria-activedescendant')) {
      return {
        pass: false,
        message: () => 'expected no aria-activedescendant attribute',
      };
    }
    if (document.activeElement !== combobox) {
      return {
        pass: false,
        message: () => `expected active element (${document.activeElement.outerHTML}) to be the combobox`,
      };
    }
    return {
      pass: true,
      message: () => 'expected to have a closed listbox',
    };
  },

  toBeOpen(combobox) { // and focused with no focused or selected option
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
    if (document.activeElement !== combobox) {
      return {
        pass: false,
        message: () => `expected active element (${document.activeElement.outerHTML}) to be the combo box`,
      };
    }
    if (combobox.getAttribute('aria-expanded') !== 'true') {
      return {
        pass: false,
        message: () => 'expected aria-expanded to be true',
      };
    }
    if (combobox.getAttribute('aria-activedescendant')) {
      return {
        pass: false,
        message: () => `expected combobox aria-activedescendant (${combobox.getAttribute('aria-activedescendant')}) not to be present`,
      };
    }
    if (listbox.getAttribute('aria-activedescendant')) {
      return {
        pass: false,
        message: () => `expected listbox aria-activedescendant (${listbox.getAttribute('aria-activedescendant')}) not to be present`,
      };
    }
    return {
      pass: true,
      message: () => 'expected the combo_box to have no active option',
    };
  },


  toHaveFocusedOption(combobox, node) { // open with a focused option
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
    if (combobox.getAttribute('aria-expanded') !== 'true') {
      return {
        pass: false,
        message: () => 'expected aria-expanded to be true',
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

  toHaveSelectedOption(combobox, node) { // open and with a selected but unfocused option
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
    if (document.activeElement !== combobox) {
      return {
        pass: false,
        message: () => `expected active element (${document.activeElement.outerHTML}) to be the combo box`,
      };
    }
    if (combobox.getAttribute('aria-activedescendant')) {
      return {
        pass: false,
        message: () => `expected combobox aria-activedescendant (${combobox.getAttribute('aria-activedescendant')}) not to be present`,
      };
    }
    if (combobox.getAttribute('aria-expanded') !== 'true') {
      return {
        pass: false,
        message: () => 'expected aria-expanded to be true',
      };
    }
    if (listbox.getAttribute('aria-activedescendant')) {
      return {
        pass: false,
        message: () => `expected listbox aria-activedescendant (${listbox.getAttribute('aria-activedescendant')}) not to be present`,
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
      message: () => 'expected the combo_box to have no active option',
    };
  },

  toHaveNotFoundMessage(combobox, message) {
    throw 'implement';
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

      it('renders a closed combo box', () => {
        const { container, getByRole } = render(<ComboBoxWrapper options={options} />);
        expect(container).toMatchSnapshot();
        expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
      });

      describe('focusing the list box', () => {
        it('opens the combo box with no option selected', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          expect(getByRole('combobox')).toBeOpen();
        });

        describe('with no options it does not open the list box', () => {
          it('does not open the combo box', () => {
            const { getByRole } = render(<ComboBoxWrapper options={[]} />);
            getByRole('combobox').focus();
            expect(getByRole('combobox')).toBeClosed();
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
            expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[0]);
          });

          it('moves to the next option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
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
            expect(getByRole('combobox')).toBeOpen();
          });

          it('does nothing with the alt key pressed', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
            expect(getByRole('combobox')).toBeOpen();
          });
        });

        describe('pressing the up arrow', () => {
          it('moves from the input to the last option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[2]);
          });

          it('moves to the previous option', () => {
            const { getByRole, getAllByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
          });

          it('moves from the first option to the input', () => {
            const { getByRole } = render((
              <ComboBoxWrapper options={options} />
            ));
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'ArrowUp' });
            expect(getByRole('combobox')).toBeOpen();
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
              expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[0]);
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
              expect(getByRole('combobox')).toBeOpen();
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
              expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[2]);
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
              expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toBeOpen();
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
              expect(getByRole('combobox')).toBeOpen();
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
              expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
              expect(getByRole('combobox')).toBeOpen();
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
              expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
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
            expect(getByRole('combobox')).toBeClosed();
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
            expect(getByRole('combobox')).toBeOpen();
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
            expect(getByRole('combobox')).toBeClosed();
          });

          it('updates the displayed value', () => {
            const { getByRole } = render(<ComboBoxWrapper options={options} />);
            getByRole('combobox').focus();
            fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
            fireEvent.keyDown(document.activeElement, { key: 'Enter' });
            expect(getByRole('combobox')).toHaveValue('Apple');
          });
        });

        describe('when blurring the listbox', () => {
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
              getByRole('textbox').focus();
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
              getByRole('textbox').focus();
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
              getByRole('textbox').focus();
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

      describe('when pressing escape on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expect(getByRole('combobox')).toBeClosed();
        });

        it('clears the focused value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expect(getByRole('combobox')).toBeOpen();
        });

        it('keeps the current value', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Enter' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'Escape' });
          expect(getByRole('combobox')).toBeClosed();
          expect(getByRole('combobox')).toHaveValue('Apple');
        });
      });

      describe('when pressing ArrowUp + alt on an option', () => {
        it('closes the list box', () => {
          const { getByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          expect(getByRole('combobox')).toBeClosed();
        });

        it('keeps the focused value', () => {
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
        });
      });

      describe('when pressing ArrowDown + alt on a closed list box', () => {
        it('opens list box with the current focused value', () => {
          const { getByRole, getAllByRole } = render(<ComboBoxWrapper options={options} />);
          getByRole('combobox').focus();
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowUp', altKey: true });
          fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
          expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
        });
      });

      describe('typing in the input', () => {
        it('searches for new options', async () => {
          const spy = jest.fn();
          const { getByRole } = render(<ComboBoxWrapper options={options} onSearch={spy} />);
          getByRole('combobox').focus();
          await userEvent.type(document.activeElement, 'test');
          expect(spy).toHaveBeenCalledWith('test');
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
        expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
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
            expect(getByRole('combobox')).toBeOpen();
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
            expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
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
          <ComboBoxWrapper options={options} value={2} onValue={spy} />,
        );
        getByRole('combobox').focus();
        expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[1]);
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
        expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[1]);
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
        expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[1]);
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
          const { getByRole, getByText } = render(
            <ComboBoxWrapper options={options} onValue={spy} />,
          );
          getByRole('combobox').focus();
          fireEvent.click(getByText('Citrus'));
          expect(spy).not.toHaveBeenCalled();
          expect(getByRole('combobox')).toBeOpen();
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
      expect(getByRole('combobox')).toBeClosed();
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
      expect(getByRole('combobox')).toBeClosed();
    });
  });

  describe('no options', () => {
    it('does not open the listbox on focus', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      expect(getByRole('combobox')).toBeClosed();
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown' });
      expect(getByRole('combobox')).toBeClosed();
    });

    it('does not open the listbox on alt + arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={[]} />,
      );
      getByRole('combobox').focus();
      fireEvent.keyDown(document.activeElement, { key: 'ArrowDown', altKey: true });
      expect(getByRole('combobox')).toBeClosed();
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
    expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[1]);
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
      expect(getByRole('combobox')).toBeClosed();
    });
  });

  describe('value is disabled', () => {
    it('selects the disabled option', () => {
      const options = [{ label: 'Apple', disabled: true }, 'Banana'];
      const { getByRole, getAllByRole } = render((
        <ComboBoxWrapper options={options} value="Apple" />
      ));
      getByRole('combobox').focus();
      expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[0]);
    });
  });

  describe('value is not in options', () => {
    const options = ['Apple', 'Banana', 'Orange'];

    it('does not select a value', () => {
      const { getByRole } = render((
        <ComboBoxWrapper options={options} value="Strawberry" />
      ));
      getByRole('combobox').focus();
      expect(getByRole('combobox')).toBeOpen();
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
      expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[2]);
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
      expect(getByRole('combobox')).toHaveFocusedOption(getAllByRole('option')[0]);
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
      expect(getByRole('combobox')).toHaveSelectedOption(getAllByRole('option')[1]);
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
      expect(getByRole('comboxbox')).toHaveAttribute('aria-autocomplete', 'none');
    });
  });

  describe('when provided', () => {
    it('sets aria-autocomplete to list', () => {
      const { getByRole } = render(<ComboBoxWrapper options={['foo']} onSearch={() => {}} />);
      expect(getByRole('combobox')).toHaveAttribute('aria-autocomplete', 'list');
    });

    describe('on focus', () => {
      it.todo('calls onSearch');
    });

    describe('typing', () => {
      it.todo('calls onSearch');
    });

    describe('on selecting a value', () => {
      it.todo('calls onSearch');
    });
  });

  describe('updating options', () => {
    const options = ['Apple', 'Banana', 'Orange'];
    const newOptions = ['Strawberry', 'Raspberry', 'Banana'];

    it('updates the displayed options', () => {
      const propUpdater = new PropUpdater();
      const { container, getByRole } = render(<ComboBoxWrapper
        options={options}
        propUpdater={propUpdater}
      />);
      fireEvent.click(getByRole('combobox'));
      propUpdater.update((props) => ({ ...props, options: newOptions }));
      expect(container).toMatchSnapshot();
    });

    describe('update contains the focused option', () => {
      it.todo('keeps the currently focused option');
    });

    describe('update does not contain the focused option', () => {
      it.todo('removes the focused option');
    });

    describe('update contains the selected option', () => {
      it('keeps the currently selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
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
      it('removes the selected option', () => {
        const propUpdater = new PropUpdater();
        const { getByRole, getAllByRole } = render(<ComboBoxWrapper
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

describe('managedFocus', () => {
  const options = ['Apple', 'Banana', 'Orange'];

  describe('when false', () => {
    it('does not set the focus to options', () => {
      const { getByRole, getAllByRole } = render(
        <ComboBoxWrapper options={options} managedFocus={false} />,
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
        <ComboBoxWrapper options={options} managedFocus={false} />,
      );
      const combobox = getByRole('combobox');
      fireEvent.click(combobox);
      const listBox = getByRole('listbox');
      fireEvent.keyDown(listBox, { key: 'ArrowDown' });
      fireEvent.keyDown(listBox, { key: 'Enter' });
      expect(combobox).toHaveTextContent('Banana');
    });

    it.todo('more tests');
  });
});

describe('autoselect', () => {
  it.todo('tests');
});

describe('className', () => {
  const options = [
    { label: 'Apple' },
    { label: 'Pear' },
    { label: 'Orange', group: 'Citrus' },
  ];

  it('adds default BEM classes', () => {
    const { container, getByRole, getAllByRole } = render(
      <ComboBoxWrapper options={options} />,
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
        <ComboBoxWrapper options={options} className={null} />,
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
        <ComboBoxWrapper options={options} className="foo" />,
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
      <ComboBoxWrapper options={options} className="foo" classGenerator={spy} />,
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
      <ComboBoxWrapper options={options} id="foo" />,
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
      <ComboBoxWrapper options={['one', 'two']} required={false} />,
    );
    expect(getByRole('combobox')).not.toHaveAttribute('aria-required');
  });

  it('when true it sets aria-required on the combobox', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['one', 'two']} required />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-required', 'true');
  });
});

describe('disabled', () => {
  describe('when false', () => {
    it('does not set aria-disabld on the combobox', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['one', 'two']} disabled={false} />,
      );
      expect(getByRole('combobox')).not.toHaveAttribute('aria-disabled');
    });
  });

  describe('when true', () => {
    it('it sets aria-disabled on the combobox', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['one', 'two']} disabled />,
      );
      expect(getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
    });

    it('does not open the listbox of click', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.click(getByRole('combobox'));
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('does not open the listbox on arrow down', () => {
      const { getByRole } = render(
        <ComboBoxWrapper options={['one', 'two']} disabled />,
      );
      fireEvent.keyDown(getByRole('combobox'), { key: 'ArrowDown' });
      expect(getByRole('listbox', { hidden: true })).not.toBeVisible();
    });

    it('does not change the value when pressing a key', () => {
      const spy = jest.fn();
      const { getByRole } = render(
        <ComboBoxWrapper options={['one', 'two']} disabled onValue={spy} />,
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
      <ComboBoxWrapper options={options} skipOption={skipOption} />,
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
      <ComboBoxWrapper options={options} findOption={findOption} />,
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
      <ComboBoxWrapper options={['foo']} WrapperComponent="dl" />,
    );
    const wrapper = container.firstChild;
    expect(wrapper.tagName).toEqual('DL');
  });

  it('allows the wrapper to be a fragment', () => {
    const { container, getByRole } = render(
      <ComboBoxWrapper options={['foo']} WrapperComponent={Fragment} />,
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
      <ComboBoxWrapper foo="bar" options={['foo']} WrapperComponent={WrapperComponent} />,
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

describe('ComboBoxComponent', () => {
  it('allows the combobox to be replaced', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} ComboBoxComponent="dl" />,
    );
    expect(getByRole('combobox').tagName).toEqual('DL');
  });
});

describe('comboBoxProps', () => {
  it('allows custom props to be added to the wrapper', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={['foo']} comboBoxProps={{ 'data-foo': 'bar' }} />,
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
    expect(container.querySelector('dl').firstChild).toHaveClass('dropdown__group');
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
      <ComboBoxWrapper
        options={[{ label: 'foo', group: 'bar' }]}
        GroupComponent="dl"
        groupWrapperProps={{ 'data-foo': 'bar' }}
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
      <ComboBoxWrapper foo="bar" options={[{ label: 'foo', group: 'bar' }]} OptionComponent={OptionComponent} />,
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
      <ComboBoxWrapper
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
      <ComboBoxWrapper options={['foo']} ValueComponent="dl" />,
    );
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('option').firstChild.tagName).toEqual('DL');
  });
});

describe('valueProps', () => {
  it('allows custom props', () => {
    const { getByRole } = render(
      <ComboBoxWrapper
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
      <ComboBoxWrapper options={options} foo="bar" />,
    );
    expect(container.querySelector('[foo="bar"]')).toEqual(null);
  });

  it('includes all data attributes on the combo box', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={options} data-foo="bar" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('data-foo', 'bar');
  });

  it('includes all aria attributes on the combo box', () => {
    const { getByRole } = render(
      <ComboBoxWrapper options={options} aria-invalid="true" />,
    );
    expect(getByRole('combobox')).toHaveAttribute('aria-invalid', 'true');
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
      <ComboBoxWrapper
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
      <ComboBoxWrapper
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
      <ComboBoxWrapper
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
      <ComboBoxWrapper
        options={options}
        layoutListBox={layoutListBox}
      />
    ));
    fireEvent.click(getByRole('combobox'));
    expect(getByRole('listbox')).toHaveStyle('color: red');
    expect(getByRole('listbox')).toHaveAttribute('class', 'dropdown__listbox foo');
  });
});
