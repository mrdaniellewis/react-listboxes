import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_FOCUSED_OPTION = 'SET_FOCUSED_OPTION';

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setFocusedOption(focusedOption) {
  return { type: SET_FOCUSED_OPTION, focusedOption };
}

export function onSelectValue(newValue) {
  return (dispatch, getState, getProps) => {
    const { onValue, value } = getProps();
    if (!newValue || newValue.unselectable) {
      dispatch({ type: SET_EXPANDED, expanded: false });
      return;
    }
    dispatch({ type: SET_SELECTED });
    if (newValue.identity !== value?.identity) {
      onValue(newValue?.value);
    }
  };
}

export function onToggleOpen(event) {
  return (dispatch, getState, getProps) => {
    const { disabled, options } = getProps();
    if (event?.button > 0 || disabled || !options.length) {
      return;
    }
    const { expanded } = getState();
    const { selectedOption } = getProps();
    if (expanded) {
      dispatch({ type: SET_EXPANDED, expanded: false });
    } else {
      dispatch(setFocusedOption(selectedOption));
    }
  };
}

export function onButtonKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { selectedOption, disabled, options } = getProps();
    const { altKey, ctrlKey, metaKey, key } = event;

    if (disabled || !options.length) {
      return;
    }

    switch (key) {
      case ' ':
      case 'Enter':
        event.preventDefault();
        dispatch(onToggleOpen());
        break;

      case 'ArrowUp':
        if (altKey) {
          break;
        }
        // fall through
      case 'ArrowDown':
        event.preventDefault();
        dispatch(setFocusedOption(selectedOption));
        break;

      default:
        if (!rNonPrintableKey.test(key) && !altKey && !ctrlKey && !metaKey) {
          event.preventDefault();
          dispatch({ type: SET_SEARCH_KEY, key });
        }
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { focusedOption } = getState();
    const { options, comboBoxRef, skipOption: skip } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    const index = focusedOption ? focusedOption.index : -1;

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(onSelectValue(focusedOption));
          comboBoxRef.current.focus();
        } else {
          dispatch(setFocusedOption(previousInList(options, index, { skip })));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (!altKey) {
          dispatch(setFocusedOption(nextInList(options, index, { skip })));
        }
        break;
      case 'Home':
        // First item
        event.preventDefault();
        dispatch(setFocusedOption(nextInList(options, -1, { skip })));
        break;
      case 'End':
        // Last item
        event.preventDefault();
        dispatch(setFocusedOption(previousInList(options, -1, { skip })));
        break;
      case 'Escape':
      case 'Enter':
      case 'Tab':
        // Select current item if one is selected
        event.preventDefault();
        if (focusedOption?.unselectable) {
          if (key !== 'Enter') {
            dispatch({ type: SET_EXPANDED, expanded: false });
            comboBoxRef.current.focus();
          }
          return;
        }
        dispatch(onSelectValue(focusedOption));
        comboBoxRef.current.focus();
        break;
      default:
        if (!rNonPrintableKey.test(key) && !altKey && !ctrlKey && !metaKey) {
          event.preventDefault();
          dispatch({ type: SET_SEARCH_KEY, key });
        }
    }
  };
}

export function onFocus() {
  return (dispatch, getState, getProps) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }
    const { selectedOption } = getProps();
    dispatch(setFocusedOption(selectedOption));
  };
}

export function onBlur() {
  return (dispatch, getState) => {
    const { focusedOption, expanded } = getState();
    if (expanded) {
      dispatch(onSelectValue(focusedOption));
    }
  };
}

export function onClick(event, option) {
  return (dispatch, getState, getProps) => {
    if (event.button > 0) {
      return;
    }

    const { comboBoxRef } = getProps();
    dispatch(onSelectValue(option));
    comboBoxRef.current.focus();
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { focusedOption, expanded } = getState();
    if (!expanded || !focusedOption) {
      return;
    }
    const { options } = getProps();
    dispatch(setFocusedOption(
      options.find((o) => o.identity === focusedOption.identity) || options[0],
    ));
  };
}
