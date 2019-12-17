import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_INDEX = 'SET_FOCUSED_INDEX';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

export function setListProps({ className, style }) {
  return { type: SET_LIST_PROPS, listClassName: className, listStyle: style };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { setValue } = getProps();
    dispatch({ type: SET_CLOSED });
    if (newValue?.unselectable) {
      return;
    }
    setValue(newValue ? newValue.value : null);
  };
}

export function onButtonKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { selectedIndex } = getProps();
    const { metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: selectedIndex });
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedIndex } = getState();
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
            dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: previousInList(options, 0) });
          } else {
            dispatch({
              type: SET_FOCUSED_INDEX,
              focusedIndex: previousInList(options, focusedIndex, { allowEmpty: true }),
            });
          }
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          if (focusedIndex === null) {
            dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: 0 });
          } else {
            dispatch({
              type: SET_FOCUSED_INDEX,
              focusedIndex: nextInList(options, focusedIndex, { allowEmpty: true }),
            });
          }
        } else {
          dispatch({ type: SET_EXPANDED, expanded: true });
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch({
            type: SET_FOCUSED_INDEX,
            focusedIndex: nextInList(options, options.length - 1),
          });
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: previousInList(options, 0) });
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
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Backspace':
      case 'Delete':
        if (managedFocus && expanded) {
          inputRef.current.focus();
        }
        break;
      default:
        if (managedFocus && expanded && !rNonPrintableKey.test(key)) {
          inputRef.current.focus();
          dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: null });
        }
    }
  };
}

export function onChange({ target: { value } }) {
  return (dispatch) => {
    dispatch({ type: 'SET_SEARCH', search: value, focusedIndex: value ? undefined : null });
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
    const { options, setValue } = getProps();
    const { focusedIndex, search } = getState();

    if (focusedIndex !== null) {
      dispatch(onSelectValue(options[focusedIndex]));
      return;
    }

    dispatch({ type: SET_CLOSED });
    if (search === '') {
      setValue(null);
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
    const { focusedIndex } = getState();
    const { options } = getProps();

    if (focusedIndex === null) {
      return;
    }

    const { identity } = prevOptions[focusedIndex];
    const index = options.findIndex((o) => o.identity === identity);

    dispatch({ type: SET_FOCUSED_INDEX, focusedIndex: index === -1 ? null : index });
  };
}
