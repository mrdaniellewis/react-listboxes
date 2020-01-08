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

function getUpdatedFocusedIndex({ prevOptions, options, focusedIndex }) {
  if (!prevOptions[focusedIndex]) {
    return null;
  }
  const { identity } = prevOptions[focusedIndex];
  const index = options.findIndex((o) => o.identity === identity);
  return index === -1 ? null : index;
}

function getInlineAutoComplete({ autoComplete, inputRef, options, focusedIndex, search }) {
  return autoComplete === 'inline'
    && search
    && focusedIndex !== null
    && options[focusedIndex]
    && options[focusedIndex].label.toLowerCase().startsWith(search.toLowerCase())
    && !options[focusedIndex].unselectable
    && inputRef.current.selectionStart === search.length;
}

function setFocusedIndex({ focusedIndex, focusListBox }) {
  return (dispatch, getState, getProps) => {
    const { expanded, search } = getState();
    const { autoComplete, inputRef, options } = getProps();

    dispatch({
      type: SET_FOCUSED_INDEX,
      focusedIndex,
      focusListBox: focusListBox ?? (focusedIndex === null ? false : expanded),
      inlineAutoComplete: getInlineAutoComplete({ autoComplete, inputRef, options, focusedIndex, search }),
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
    inputRef.current.value = newValue?.label ?? '';
    inputRef.current.dispatchEvent(new Event('click', { bubbles: true }));
    onValue(newValue ? newValue.value : null);
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedIndex } = getState();
    const { options, inputRef, managedFocus, lastKeyRef } = getProps();
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
      case 'Delete':
        lastKeyRef.current = key;
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
    const { onChange: passedOnChange, autoComplete, inputRef, options, lastKeyRef, lastKeyRef: { current: key } } = getProps();
    let { focusedIndex } = getState();
    const { target: { value: search } } = event;
    lastKeyRef.current = null;
    if (!search) {
      dispatch({ type: SET_SEARCH, search, focusedIndex: null });
    } else {
      console.log(key);
      if (key === 'Delete') {
        focusedIndex = null;
      } else {
        focusedIndex = getAutoCompleteFocusedIndex({ autoComplete, options, focusListBox: false, search }) ?? focusedIndex;
      }

      dispatch({
        type: SET_SEARCH,
        focusedIndex,
        search,
        inlineAutoComplete: getInlineAutoComplete({ autoComplete, inputRef, options, focusedIndex, search }),
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

export function onOptionsChanged(prevOptions) {
  return (dispatch, getState, getProps) => {
    const { search, focusedIndex, focusListBox } = getState();
    const { autoComplete, inputRef, options, selectedIndex } = getProps();

    if (search === null && selectedIndex !== null) {
      dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: selectedIndex, inlineAutoComplete: false });
    }

    dispatch({
      type: SET_FOCUSED_INDEX,
      focusedIndex: getAutoCompleteFocusedIndex({ autoComplete, options, focusListBox, search }) ?? getUpdatedFocusedIndex({ prevOptions, options, focusedIndex }),
      inlineAutoComplete: getInlineAutoComplete({ autoComplete, inputRef, options, focusedIndex, search }),
    });
  };
}
