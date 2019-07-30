import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED_VALUE = 'SET_SELECTED_VALUE';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setSearchKey(key) {
  return { type: SET_SEARCH_KEY, key };
}

export function setSelectedValue(selectedValue) {
  return { type: SET_SELECTED_VALUE, selectedValue };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, selectedValue } = getState();
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

    const selectedIndex = selectedValue
      ? options.findIndex(o => o.value === selectedValue.value)
      : -1;

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(setExpanded(false));
        } else if (expanded) {
          dispatch(setSelectedValue(previousInList(options, selectedIndex)));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setSelectedValue(nextInList(options, selectedIndex)));
        } else {
          dispatch(setExpanded(true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedValue(nextInList(options, options.length - 1)));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedValue(previousInList(options, 0)));
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
    const { value } = getProps();
    if (open) {
      dispatch(setSelectedValue(value));
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
    const { expanded, selectedValue } = getState();
    if (expanded) {
      return;
    }
    const { setValue, value, options } = getProps();
    if (selectedValue !== value
      && (!selectedValue || options.find(o => o.value === selectedValue.value))
    ) {
      setValue(selectedValue);
    }
    dispatch(setExpanded(false));
  };
}
