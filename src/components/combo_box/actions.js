import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';

export const SET_ACTIVE = 'SET_ACTIVE';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SEARCH = 'SET_SEARCH';
export const SET_INACTIVE = 'SET_INACTIVE';
export const SET_SELECTED_VALUE = 'SET_SELECTED_VALUE';

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

export function setSelectedValue(selectedValue) {
  return { type: SET_SELECTED_VALUE, selectedValue };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, selectedValue } = getState();
    const { busy, options, setValue, valueIndex, value } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setInactive(value ? value.label : ''));
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
          dispatch(setSelectedValue(previousInList(options, selectedIndex, true)));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setSelectedValue(nextInList(options, selectedIndex, true)));
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
        if (expanded && valueIndex !== -1) {
          event.preventDefault();
          setValue(options[selectedIndex]);
          dispatch(setInactive(options[selectedIndex].label));
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
    const { onSearch, setValue } = getProps();
    onSearch(value);
    setValue(null);
    dispatch(setActive(value));
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { options, value } = getProps();
    if (options.length === 1 && value && options[0].value === value.value) {
      TODO
      dispatch(setSearch(value ? value.label : ''));
    } else {
      dispatch(setActive(value ? value.label : ''));
    }
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
    const { setValue, value, options } = getProps();
    const { selectedValue } = getState();
    if (selectedValue !== value
      && (!selectedValue || options.find(o => o.value === selectedValue.value))
    ) {
      setValue(selectedValue);
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
