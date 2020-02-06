import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_OPTION = 'SET_FOCUSED_OPTION';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

function getInlineAutoComplete({ key, autoComplete, inputRef, option, search }) {
  return autoComplete === 'inline'
    && search
    && key !== 'Backspace'
    && key !== 'Delete'
    && option
    && !option.unselectable
    && option.label.toLowerCase().startsWith(search.toLowerCase())
    && inputRef.current.selectionStart === search.length;
}

export function setFocusedOption(focusedOption, focusListBox) {
  return { type: SET_FOCUSED_OPTION, focusedOption, focusListBox };
}

export function setListProps({ className, style }) {
  return { type: SET_LIST_PROPS, listClassName: className, listStyle: style };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { onValue, inputRef } = getProps();
    dispatch({ type: SET_CLOSED });
    if (newValue?.unselectable) {
      return;
    }
    const { current: input } = inputRef;
    input.value = newValue?.label ?? '';
    input.dispatchEvent(new Event('click', { bubbles: true }));
    input.setSelectionRange(input.value.length, input.value.length, 'forward');
    onValue(newValue ? newValue.value : null);
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedOption } = getState();
    const { options, inputRef, managedFocus, lastKeyRef, skipOption: skip } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    lastKeyRef.current = key;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch({ type: SET_CLOSED });
      inputRef.current.focus();
      return;
    }

    const index = focusedOption ? focusedOption.index : -1;

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch({ type: SET_EXPANDED, expanded: false });
          inputRef.current.focus();
        } else if (expanded) {
          dispatch(setFocusedOption(
            previousInList(options, index, { skip, allowEmpty: true }),
            true,
          ));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setFocusedOption(
            nextInList(options, index, { skip, allowEmpty: true }),
            true,
          ));
        } else {
          dispatch({ type: SET_EXPANDED, expanded: true });
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption(
            nextInList(options, -1, { skip }),
            true,
          ));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedOption(
            previousInList(options, -1, { skip }),
            true,
          ));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        if (!expanded) {
          break;
        }
        event.preventDefault();
        if (focusedOption && !focusedOption?.unselectable) {
          dispatch(onSelectValue(focusedOption));
          if (managedFocus) {
            inputRef.current.focus();
          }
        }
        break;
      case 'Delete':
        dispatch(setFocusedOption(null));
        // fallthrough
      case 'Backspace':
      case 'ArrowLeft':
      case 'ArrowRight':
        if (managedFocus && expanded) {
          inputRef.current.focus();
        }
        break;
      default:
        if (managedFocus && expanded && !rNonPrintableKey.test(key)) {
          inputRef.current.focus();
        }
    }
  };
}

export function onChange(event) {
  return (dispatch, getState, getProps) => {
    const { onChange: passedOnChange } = getProps();
    const { target: { value: search } } = event;
    dispatch({ type: SET_SEARCH, search });
    passedOnChange(event);
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { selectedOption } = getProps();
    dispatch(setFocusedOption(selectedOption));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { onValue } = getProps();
    const { focusedOption, search } = getState();

    if (focusedOption) {
      dispatch(onSelectValue(focusedOption));
      return;
    }

    dispatch({ type: SET_CLOSED });
    if (search === '') {
      onValue(null);
    }
  };
}

export function onClick(event, option) {
  return (dispatch, getState, getProps) => {
    if (event.button > 0) {
      return;
    }

    const { buttonRef } = getProps();
    dispatch(onSelectValue(option));
    buttonRef.current.focus();
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { focusedOption, expanded } = getState();
    if (!expanded || !focusedOption) {
      return;
    }
    const { options } = getProps();
    dispatch(setFocusedOption(
      options.find((o) => o.identity === focusedOption.identity) || options[0],
    ));
  };
}
