import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_OPTIONS = 'SET_OPTIONS';
export const SET_BUSY = 'SET_BUSY';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setSearch(key) {
  return { type: SET_SEARCH, key };
}

export function setOptions({ options, value }) {
  return { type: SET_OPTIONS, options, value };
}

export function setBusy(busy) {
  return { type: SET_BUSY, busy };
}

export function onKeyDown(event) {
  return (dispatch, { busy, open, options, selectedIndex, setValue }) => {
    const { altKey, metaKey, ctrlKey, key } = event;

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
        if (open) {
          event.preventDefault();
          setValue(nextInList(options, options.length - 1));
        }
        break;
      case 'End':
        // Last item
        if (open) {
          event.preventDefault();
          setValue(previousInList(options, 0));
        }
        break;
      case 'Enter':
        // Select current item if one is selected
        event.preventDefault();
        if (open && selectedIndex !== null) {
          setValue(options[selectedIndex]);
          dispatch(setExpanded(false));
        }
        break;
      default:
        // Determine if it is a printable key
        // All special keys all ascii sequences starting with a capital letter
        // Printable characters will be something plus, optionally, some non ascii modifiers
        if (!/^[A-Z][A-Za-z0-9]/.test(key)) {
          dispatch(setSearch(key));
        }
    }
  };
}
