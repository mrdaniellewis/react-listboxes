import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_INDEX = 'SET_FOCUSED_INDEX';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

function applyAutocomplete(action) {
  return (dispatch, getState, getProps) => {
    const { autoComplete, inputRef, options } = getProps();
    const focusedIndex = 'focusedIndex' in action ? action.focusedIndex : getState().focusedIndex;
    const search = 'search' in action ? action.search : getState().search;

    const inlineAutoComplete = autoComplete === 'inline'
      && action.inlineAutoComplete !== false
      && search
      && options[focusedIndex]
      && options[focusedIndex].label.toLowerCase().startsWith(search.toLowerCase())
      && !options[focusedIndex].unselectable
      && inputRef.current.selectionStart === search.length;

    dispatch({ ...action, inlineAutoComplete });
  };
}

export function setFocusedIndex({ focusedIndex, focusListBox }) {
  return (dispatch, getState) => {
    const { expanded } = getState();

    dispatch(applyAutocomplete({
      type: SET_FOCUSED_INDEX,
      focusedIndex,
      focusListBox: focusListBox ?? (focusedIndex === null ? false : expanded),
    }));
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
    inputRef.current.value = newValue?.label ?? '';
    inputRef.current.dispatchEvent(new Event('click', { bubbles: true }));
    onValue(newValue ? newValue.value : null);
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedIndex, search, inlineAutoComplete } = getState();
    const { options, inputRef, managedFocus } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

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
      case 'Backspace':
        if (inlineAutoComplete) {
          event.preventDefault();
          dispatch({
            type: SET_SEARCH,
            search: search === null ? search : search.slice(0, -1),
            inlineAutoComplete: false,
          });
        }
        // Fall through
      case 'Delete':
        dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: null, inlineAutoComplete: false });
        // Fall through
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
    const { target: { value } } = event;
    if (!value) {
      dispatch({ type: SET_SEARCH, search: value, focusedIndex: null });
    } else {
      dispatch(applyAutocomplete({
        type: SET_SEARCH,
        search: value,
      }));
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

export function onOptionsChanged(prevOptions) {
  return (dispatch, getState, getProps) => {
    const { search, focusedIndex, inlineAutoComplete } = getState();
    const { options, selectedIndex } = getProps();

    if (search === null && selectedIndex !== null) {
      dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: selectedIndex, inlineAutoComplete: false });
    }

    if (!prevOptions[focusedIndex]) {
      return;
    }

    const { identity } = prevOptions[focusedIndex];
    const index = options.findIndex((o) => o.identity === identity);

    dispatch(setFocusedIndex({ focusedIndex: index === -1 ? null : index, inlineAutoComplete }));
  };
}
