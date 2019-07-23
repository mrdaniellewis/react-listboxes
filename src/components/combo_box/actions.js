import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_ACTIVE = 'SET_ACTIVE';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_INACTIVE = 'SET_INACTIVE';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setActive(search) {
  return { type: SET_ACTIVE, search };
}

export function setSearch(search) {
  return { type: SET_SEARCH, search };
}

export function setInactive(search) {
  return { type: SET_INACTIVE, search };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    const { busy, options, setValue, valueIndex, value } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setInactive(value.label));
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
          setValue(previousInList(options, valueIndex));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          setValue(nextInList(options, valueIndex));
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
        if (expanded && valueIndex !== -1) {
          event.preventDefault();
          setValue(options[valueIndex]);
          dispatch(setInactive(options[valueIndex].label));
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
    dispatch(setActive(value));
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { value } = getProps();
    dispatch(setActive(value ? value.label : ''));
  };
}

export function onClick(value) {
  return (dispatch, setState, getProps) => {
    const { setValue, onSearch } = getProps();
    setValue(value);
    onSearch(value.label);
    dispatch(setInactive(value.label));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { search } = getState();
    const { setValue } = getProps();
    if (search === '') {
      setValue(null);
    }
    dispatch(setInactive(null));
  };
}

export function onClearValue() {
  return (dispatch, setState, getProps) => {
    const { onSearch, setValue } = getProps();
    dispatch(setInactive(''));
    onSearch(null);
    setValue(null);
  };
}
