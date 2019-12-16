import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_SEARCH = 'SET_SEARCH';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_CLOSED = 'SET_CLOSED';
export const SET_FOCUSED_INDEX = 'SET_FOCUSED_INDEX';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';
export const SET_HIGHLIGHT = 'SET_HIGHLIGHT';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setFocusedIndex(focusedIndex) {
  return { type: SET_FOCUSED_INDEX, focusedIndex };
}

export function setClosed() {
  return { type: SET_CLOSED };
}

export function setListProps({ className, style }) {
  return { type: SET_LIST_PROPS, listClassName: className, listStyle: style };
}

export function setHighlight(highlight) {
  return { type: SET_HIGHLIGHT, highlight };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { setValue } = getProps();
    if (newValue?.unselectable) {
      dispatch(setClosed());
      return;
    }
    dispatch(setClosed());
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
      dispatch(setFocusedIndex(selectedIndex));
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, focusedIndex, highlight } = getState();
    const { options, inputRef, managedFocus, autoSelect } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setClosed());
      inputRef.current.focus();
      return;
    }

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(setExpanded(false));
          inputRef.current.focus();
        } else if (expanded) {
          if (focusedIndex === null) {
            dispatch(setFocusedIndex(previousInList(options, 0)));
          } else {
            dispatch(setFocusedIndex(previousInList(options, focusedIndex, { allowEmpty: true })));
          }
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          if (focusedIndex === null) {
            dispatch(setFocusedIndex(0));
          } else {
            dispatch(setFocusedIndex(nextInList(options, focusedIndex, { allowEmpty: true })));
          }
        } else {
          dispatch(setExpanded(true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedIndex(nextInList(options, options.length - 1)));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setFocusedIndex(previousInList(options, 0)));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        if (!expanded) {
          break;
        }
        event.preventDefault();
        if (focusedIndex !== null) {
          if (options[focusedIndex].unselectable) {
            break;
          }
          dispatch(onSelectValue(options[focusedIndex]));
          if (managedFocus) {
            inputRef.current.focus();
          }
        } else if (autoSelect) {
          const option = options.find((o) => !o.unselectable);
          if (option) {
            dispatch(onSelectValue(option));
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
        dispatch(setFocusedIndex(null));
        if (highlight && autoSelect === 'inline') {
          dispatch(setHighlight(false));
        }
        break;
      default:
        if (managedFocus && expanded && !rNonPrintableKey.test(key)) {
          inputRef.current.focus();
          dispatch(setFocusedIndex(null));
        }
    }
  };
}

export function onChange({ target: { value } }) {
  return (dispatch, getState, getProps) => {
    const { inputRef, autoSelect } = getProps();

    dispatch({ type: 'SET_SEARCH', search: value });
  };
}

export function onFocus() {
  return (dispatch, getState) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    dispatch(setExpanded(true));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { options, setValue, autoSelect } = getProps();
    const { focusedIndex, search } = getState();

    if (focusedIndex !== null) {
      dispatch(onSelectValue(options[focusedIndex]));
      return;
    }

    if (autoSelect && search) {
      const option = options.find((o) => !o.unselectable);
      if (option) {
        dispatch(onSelectValue(option));
        return;
      }
    }

    dispatch(setClosed());
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

    dispatch(setFocusedIndex(index === -1 ? null : index));
  };
}
