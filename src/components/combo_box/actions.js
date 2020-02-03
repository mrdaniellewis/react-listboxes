import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_INDEX = 'SET_FOCUSED_INDEX';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

function getAutoCompleteFocusedIndex({ autoComplete, options, focusListBox, search }) {
  if (autoComplete && !focusListBox && search && options?.length) {
    for (let i = 0; i < options.length; i += 1) {
      if (!options[i].unselectable) {
        if (options[i].label.toLowerCase().startsWith(search.toLowerCase())) {
          return i;
        }
        break;
      }
    }
  }
  return null;
}

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

function setFocusedIndex({ focusedIndex, focusListBox }) {
  return (dispatch, getState) => {
    const { expanded } = getState();

    dispatch({
      type: SET_FOCUSED_INDEX,
      focusedIndex,
      focusListBox: focusListBox ?? (focusedIndex === null ? false : expanded),
      inlineAutoComplete: false,
    });
  };
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
    const { expanded, focusedIndex } = getState();
    const { options, inputRef, managedFocus, lastKeyRef } = getProps();
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

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch({ type: SET_EXPANDED, expanded: false });
          inputRef.current.focus();
        } else if (expanded) {
          if (focusedIndex === null) {
            dispatch(setFocusedIndex({
              focusedIndex: previousInList(options, 0),
            }));
          } else {
            dispatch(setFocusedIndex({
              focusedIndex: previousInList(options, focusedIndex, { allowEmpty: true }),
            }));
          }
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          if (focusedIndex === null) {
            dispatch(setFocusedIndex({ focusedIndex: 0 }));
          } else {
            dispatch(setFocusedIndex({
              focusedIndex: nextInList(options, focusedIndex, { allowEmpty: true }),
            }));
          }
        } else {
          dispatch({ type: SET_EXPANDED, expanded: true });
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedIndex({
            focusedIndex: nextInList(options, options.length - 1),
          }));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedIndex({ focusedIndex: previousInList(options, 0) }));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        if (!expanded) {
          break;
        }
        event.preventDefault();
        if (focusedIndex !== null && !options[focusedIndex].unselectable) {
          dispatch(onSelectValue(options[focusedIndex]));
          if (managedFocus) {
            inputRef.current.focus();
          }
        }
        break;
      case 'Delete':
        dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: null });
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
    const {
      onChange: passedOnChange, autoComplete, inputRef, options, lastKeyRef: { current: key },
    } = getProps();
    let { focusedIndex } = getState();
    const { target: { value: search } } = event;
    if (!search) {
      dispatch({ type: SET_SEARCH, search, focusedIndex: null });
    } else {
      if (key === 'Delete') {
        focusedIndex = null;
      } else if (key !== 'Backspace') {
        focusedIndex = getAutoCompleteFocusedIndex({
          autoComplete, options, focusListBox: false, search,
        }) ?? focusedIndex;
      }

      dispatch({
        type: SET_SEARCH,
        focusedIndex,
        search,
        inlineAutoComplete: getInlineAutoComplete({
          key, autoComplete, inputRef, option: options[focusedIndex], search,
        }),
      });
    }
    passedOnChange(event);
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { selectedIndex } = getProps();
    dispatch({ type: SET_EXPANDED, expanded: true, focusedIndex: selectedIndex });
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { options, onValue } = getProps();
    const { focusedIndex, search } = getState();

    if (focusedIndex !== null) {
      dispatch(onSelectValue(options[focusedIndex]));
      return;
    }

    dispatch({ type: SET_CLOSED });
    if (search === '') {
      onValue(null);
    }
  };
}

export function onClick(e, value) {
  return (dispatch, getState, getProps) => {
    if (e.button > 0) {
      return;
    }

    const { buttonRef } = getProps();
    dispatch(onSelectValue(value));
    buttonRef.current.focus();
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { search, focusListBox, focusedIdentity } = getState();
    let { focusedIndex } = getState();
    const {
      autoComplete, inputRef, options, selectedIndex, lastKeyRef: { current: key },
    } = getProps();

    // If the user is not searching the focused index is the currently selected index
    if (search === null && selectedIndex !== null) {
      dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: selectedIndex, inlineAutoComplete: false });
      return;
    }

    // Get the focused index if autocomplete is valid
    focusedIndex = getAutoCompleteFocusedIndex({ autoComplete, options, focusListBox, search });

    // If there is no focused index, ensure it is on right option
    focusedIndex = options.findIndex((o) => o.identity === focusedIdentity);
    focusedIndex = focusedIndex === -1 ? null : focusedIndex;

    dispatch({
      type: SET_FOCUSED_INDEX,
      focusedIndex,
      inlineAutoComplete: getInlineAutoComplete({
        key, autoComplete, inputRef, option: options[focusedIndex], search,
      }),
    });
  };
}
