import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED_INDEX = 'SET_SELECTED_INDEX';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setSearchKey(key) {
  return { type: SET_SEARCH_KEY, key };
}

export function setSelectedIndex(selectedIndex) {
  return { type: SET_SELECTED_INDEX, selectedIndex };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, selectedIndex } = getState();
    const { busy, options, setValue } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setExpanded(false));
      return;
    }

    if (busy || !options || !options.length) {
      return;
    }

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(setExpanded(false));
        } else if (expanded) {
          dispatch(setSelectedIndex(previousInList(options, selectedIndex)));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setSelectedIndex(nextInList(options, selectedIndex)));
        } else {
          dispatch(setExpanded(true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedIndex(nextInList(options, options.length - 1)));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedIndex(previousInList(options, 0)));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        if (expanded && selectedIndex !== -1) {
          event.preventDefault();
          setValue(options[selectedIndex]);
          dispatch(setExpanded(false));
        }
        break;
      default:
        // Determine if it is a printable key
        // All special keys all ascii sequences starting with a capital letter
        // Printable characters will be something plus, optionally, some non ascii modifiers
        if (expanded && !/^[A-Z][A-Za-z0-9]/.test(key)) {
          dispatch(setSearchKey(key));
        }
    }
  };
}

export function onToggleOpen(open) {
  return (dispatch, getState, getProps) => {
    const { valueIndex } = getProps();
    if (open) {
      dispatch(setSelectedIndex(valueIndex));
    } else {
      dispatch(setExpanded(false));
    }
  };
}

export function onClick(value) {
  return (dispatch, getState, getProps) => {
    const { setValue } = getProps();
    setValue(value);
    dispatch(setExpanded(false));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { setValue, value, options } = getProps();
    const { selectedIndex } = getState();
    if (options[selectedIndex].value !== (value && value.value)) {
      setValue(options[selectedIndex] || null);
    }
    dispatch(setExpanded(false));
  };
}
