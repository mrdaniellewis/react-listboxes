import { nextInList } from '../../helpers/next_in_list.js';
import { previousInList } from '../../helpers/previous_in_list.js';
import { rNonPrintableKey } from '../../constants/r_non_printable_key.js';

export const SET_EXPANDED = 'SET_EXPANDED';
export const CLEAR_SEARCH = 'CLEAR_SEARCH';
export const SET_SEARCH_KEY = 'SET_SEARCH_KEY';
export const SET_SELECTED = 'SET_SELECTED';
export const SET_SELECTED_OPTION = 'SET_SELECTED_OPTION';
export const SET_LIST_PROPS = 'SET_LIST_PROPS';

export function clearSearch() {
  return { type: CLEAR_SEARCH };
}

export function setSelectedOption(selectedOption) {
  return { type: SET_SELECTED_OPTION, selectedOption };
}

export function setListProps({ className, style }) {
  return { type: SET_LIST_PROPS, listClassName: className, listStyle: style };
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
    if (event?.button > 0) {
      return;
    }
    const { expanded } = getState();
    const { value } = getProps();
    if (expanded) {
      dispatch({ type: SET_EXPANDED, expanded: false });
    } else {
      dispatch(setSelectedOption(value));
    }
  };
}

export function onButtonKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { value } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
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
        dispatch(setSelectedOption(value));
        break;

      default:
        if (!rNonPrintableKey.test(key)) {
          dispatch({ type: SET_SEARCH_KEY, key });
        }
    }
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { selectedOption } = getState();
    const { options, comboBoxRef, skipOption: skip } = getProps();
    const { altKey, metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    const index = options.findIndex((o) => o.key === selectedOption?.key);

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(onSelectValue(selectedOption));
          comboBoxRef.current.focus();
        } else {
          dispatch(setSelectedOption(previousInList(options, index, { skip })));
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (!altKey) {
          dispatch(setSelectedOption(nextInList(options, index, { skip })));
        }
        break;
      case 'Home':
        // First item
        event.preventDefault();
        dispatch(setSelectedOption(nextInList(options, -1, { skip })));
        break;
      case 'End':
        // Last item
        event.preventDefault();
        dispatch(setSelectedOption(previousInList(options, -1, { skip })));
        break;
      case 'Escape':
      case 'Enter':
      case 'Tab':
        // Select current item if one is selected
        event.preventDefault();
        if (selectedOption?.unselectable) {
          if (key !== 'Enter') {
            dispatch({ type: SET_EXPANDED, expanded: false });
            comboBoxRef.current.focus();
          }
          return;
        }
        dispatch(onSelectValue(selectedOption));
        comboBoxRef.current.focus();
        break;
      default:
        if (!rNonPrintableKey.test(key)) {
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
    const { value } = getProps();
    dispatch(setSelectedOption(value));
  };
}

export function onBlur() {
  return (dispatch, getState) => {
    const { selectedOption, expanded } = getState();
    if (expanded) {
      dispatch(onSelectValue(selectedOption));
    }
  };
}

export function onClick(event, value) {
  return (dispatch, getState, getProps) => {
    if (event.button > 0) {
      return;
    }

    const { comboBoxRef } = getProps();
    dispatch(onSelectValue(value));
    comboBoxRef.current.focus();
  };
}

export function onOptionsChanged() {
  return (dispatch, getState, getProps) => {
    const { selectedOption, expanded } = getState();
    if (!expanded || !selectedOption) {
      return;
    }
    const { options } = getProps();
    dispatch(setSelectedOption(
      options.find((o) => o.identity === selectedOption.identity) || options[0],
    ));
  };
}
