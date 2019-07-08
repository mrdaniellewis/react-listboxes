import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH = 'SET_SEARCH';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setSearch(search) {
  return { type: SET_SEARCH, search };
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
        } else if (expanded) {
          setValue(previousInList(options, selectedIndex));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
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
        if (expanded && selectedIndex !== -1) {
          event.preventDefault();
          setValue(options[selectedIndex].value);
          dispatch(setExpanded(false));
        }
        break;
      default:
        // Nothing
    }
  };
}

export function onChange(event) {
  return (dispatch, getState, getProps) => {
    const { target: { value } } = event;
    const { onSearch } = getProps();
    onSearch(value);
    dispatch(setSearch(value));
  };
}
