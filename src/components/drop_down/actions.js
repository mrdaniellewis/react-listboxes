import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { equalValues } from '../../helpers/equal_values.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_SELECTED_VALUE = 'SET_SELECTED_VALUE';
export const SET_MOUSE_OVER = 'SET_MOUSE_OVER';

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

export function setSelected(selectedValue) {
  return {
    type: SET_SELECTED,
    selectedValue,
  };
}

export function setMouseOver(mouseOver) {
  return { type: SET_MOUSE_OVER, mouseOver };
}

export function onSelectValue(value) {
  return (dispatch, getState, getProps) => {
    const { setValue, buttonRef } = getProps();
    dispatch(setSelected(value));
    setValue(value);
    if (value && value.onClick) {
      value.onClick();
    }
    buttonRef.current.focus();
  };
}

export function onButtonKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { value } = getProps();
    const { metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      dispatch(setSelectedValue(value));
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, selectedValue } = getState();
    const { options, buttonRef } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'Escape') {
      event.preventDefault();
      dispatch(setExpanded(false));
      buttonRef.current.focus();
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
        if (expanded && selectedIndex !== -1 && options[selectedIndex]) {
          event.preventDefault();
          dispatch(onSelectValue(options[selectedIndex]));
        }
        break;
      default:
        if (expanded && !rNonPrintableKey.test(key)) {
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

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { value } = getProps();
    dispatch(setSelectedValue(value));
  };
}

export function onBlur() {
  return (dispatch, getState, getProps) => {
    const { value } = getProps();
    const { selectedValue } = getState();
    if (!equalValues(value, selectedValue)) {
      dispatch(onSelectValue(selectedValue));
    } else {
      dispatch(setExpanded(false));
    }
  };
}

export function onMouseEnter() {
  return (dispatch, getState) => {
    dispatch(setMouseOver(true));

    const { expanded } = getState();

    if (!expanded) {
      dispatch(onToggleOpen(true));
    }
  };
}

export function onMouseLeave() {
  return (dispatch, getState) => {
    dispatch(setMouseOver(false));

    setTimeout(() => {
      const { expanded, mouseOver } = getState();
      if (expanded && !mouseOver) {
        dispatch(onToggleOpen(false));
      }
    }, 200);
  };
}
