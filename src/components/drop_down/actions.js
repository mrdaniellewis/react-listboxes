import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setSearchKey(key) {
  return { type: SET_SEARCH_KEY, key };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    const { busy, options, setValue, value } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;
    const selectedIndex = options.findIndex(option => option.value === value);

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setExpanded(false));
      setValue(null);
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
        } else {
          setValue(previousInList(options, selectedIndex));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (!altKey) {
          setValue(nextInList(options, selectedIndex));
        } else {
          dispatch(setExpanded(true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          setValue(nextInList(options, options.length - 1));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          setValue(previousInList(options, 0));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        event.preventDefault();
        if (expanded && selectedIndex !== null) {
          setValue(options[selectedIndex]);
          dispatch(setExpanded(false));
        }
        break;
      default:
        // Determine if it is a printable key
        // All special keys all ascii sequences starting with a capital letter
        // Printable characters will be something plus, optionally, some non ascii modifiers
        if (!/^[A-Z][A-Za-z0-9]/.test(key)) {
          dispatch(setSearchKey(key));
        }
    }
  };
}
