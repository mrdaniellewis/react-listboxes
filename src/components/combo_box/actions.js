import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { equalValues } from '../../helpers/equal_values.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_ACTIVE = 'SET_ACTIVE';
export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_INACTIVE = 'SET_INACTIVE';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_SELECTED_VALUE = 'SET_SELECTED_VALUE';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setActive({ search, selectedValue, expanded }) {
  return { type: SET_ACTIVE, search, selectedValue, expanded };
}

export function setInactive(selectedValue) {
  return { type: SET_INACTIVE, selectedValue };
}

export function setSelected(selectedValue) {
  return {
    type: SET_SELECTED,
    selectedValue,
    search: selectedValue ? selectedValue.label : '',
  };
}

export function setSelectedValue(selectedValue) {
  return { type: SET_SELECTED_VALUE, selectedValue };
}

export function onSelectValue(value) {
  return (dispatch, getState, getProps) => {
    const { setValue, onSearch } = getProps();
    dispatch(setSelected(value));
    setValue(value);
    onSearch(value ? value.label : '');
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { search, expanded, selectedValue, listBoxFocused } = getState();
    const { busy, options, value, managedFocus, inputRef } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setSelected(value));
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
        } else {
          dispatch(setSelectedValue(previousInList(options, selectedIndex, true)));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (!altKey) {
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
        if (expanded) {
          if (selectedIndex !== -1 && options[selectedIndex]) {
            event.preventDefault();
            dispatch(onSelectValue(options[selectedIndex]));
          } else if (!search) {
            event.preventDefault();
            dispatch(onSelectValue(null));
          }
        }
        break;
      case 'Delete':
      case 'Backspace':
      case 'ArrowLeft':
      case 'ArrowRight':
      case 'Tab':
        if (managedFocus && listBoxFocused) {
          inputRef.current.focus();
        }
        break;
      default:
        if (managedFocus && listBoxFocused && !rNonPrintableKey.test(key)) {
          inputRef.current.focus();
        }
    }
  };
}

export function onChange(event) {
  return (dispatch, getState, getProps) => {
    const { target: { value } } = event;
    const { onSearch } = getProps();
    dispatch(setActive({ search: value, selectedValue: null, expanded: true }));
    onSearch(value);
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { options, value, onSearch } = getProps();
    const { focused } = getState();
    if (focused) {
      return;
    }
    const expanded = !(options.length === 1 && value && options[0].value === value.value);
    dispatch(setActive({ search: value ? value.label : '', selectedValue: value, expanded }));
    onSearch(value ? value.label : '');
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { setValue, value } = getProps();
    const { selectedValue } = getState();
    if (!equalValues(value, selectedValue)) {
      dispatch(setInactive(selectedValue));
      setValue(selectedValue);
    } else {
      dispatch(setInactive(value));
    }
  };
}
