import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_FOCUSED_INDEX = 'SET_FOCUSED_INDEX';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setFocusedIndex(focusedIndex) {
  return { type: SET_FOCUSED_INDEX, focusedIndex };
}

export function setListProps({ className, style }) {
  return { type: SET_LIST_PROPS, listClassName: className, listStyle: style };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { setValue, value } = getProps();
    if (newValue.unselectable) {
      dispatch({ type: SET_EXPANDED, expanded: false });
      return;
    }
    dispatch({ type: SET_SELECTED });
    if (newValue.identity !== value?.identity) {
      setValue(newValue?.value);
    }
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
    const { expanded, focusedIndex } = getState();
    const { options, buttonRef } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch({ type: SET_EXPANDED, expanded: false });
      buttonRef.current.focus();
      return;
    }

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch({ type: SET_EXPANDED, expanded: false });
        } else if (expanded) {
          dispatch(setFocusedIndex(previousInList(options, focusedIndex)));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setFocusedIndex(nextInList(options, focusedIndex)));
        } else {
          dispatch({ type: SET_EXPANDED, expanded: true });
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
        if (expanded && focusedIndex !== -1 && options[focusedIndex]) {
          event.preventDefault();
          if (options[focusedIndex].unselectable) {
            return;
          }
          dispatch(onSelectValue(options[focusedIndex]));
          buttonRef.current.focus();
        }
        break;
      default:
        if (expanded && !rNonPrintableKey.test(key)) {
          dispatch({ type: SET_SEARCH_KEY, key });
        }
    }
  };
}

export function onToggleOpen() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    const { selectedIndex } = getProps();
    if (expanded) {
      dispatch({ type: SET_EXPANDED, expanded: false });
    } else {
      dispatch(setFocusedIndex(selectedIndex));
    }
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { selectedIndex } = getProps();
    dispatch(setFocusedIndex(selectedIndex));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { options } = getProps();
    const { focusedIndex, expanded } = getState();
    if (expanded) {
      dispatch(onSelectValue(options[focusedIndex]));
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

    dispatch(setFocusedIndex(index === -1 ? 0 : index));
  };
}
