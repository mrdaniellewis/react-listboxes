export const SET_EXPANDED = 'SET_EXPANDED';
export const SET_SELECTED_INDEX = 'SET_SELECTED_INDEX';

export function setExpanded(expanded) {
  return { type: SET_EXPANDED, expanded };
}

export function setSelectedIndex(selectedIndex) {
  return { type: SET_SELECTED_INDEX, selectedIndex };
}

export function onButtonKeyDown(event) {
  return (dispatch) => {
    const { metaKey, ctrlKey, key } = event;

    if (metaKey || ctrlKey) {
      return;
    }

    if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      dispatch(setExpanded(true));
    }
  };
}

export function onClick(option) {
  return (dispatch, getState, getProps) => {
    if (option.disabled || !option.onClick) {
      return;
    }
    const { buttonRef } = getProps();
    dispatch(setExpanded(false));
    option.onClick();
    buttonRef.current.focus();
  };
}

export function onKeyDown(event) {
  return (dispatch, getState, getProps) => {
    const { expanded, selectedIndex } = getState();
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

    switch (key) {
      case 'ArrowUp':
        // Close if altKey, otherwise next item and show
        event.preventDefault();
        if (altKey) {
          dispatch(setExpanded(false));
          buttonRef.current.focus();
        } else if (expanded) {
          if (selectedIndex === 0) {
            dispatch(setSelectedIndex(options.length - 1));
          } else {
            dispatch(setSelectedIndex(selectedIndex - 1));
          }
        }
        break;
      case 'ArrowDown':
        // Show, and next item unless altKey
        event.preventDefault();
        if (expanded && !altKey) {
          dispatch(setSelectedIndex((selectedIndex + 1) % options.length));
        } else {
          dispatch(setExpanded(true));
        }
        break;
      case 'Home':
        // First item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedIndex(0));
        }
        break;
      case 'End':
        // Last item
        if (expanded) {
          event.preventDefault();
          dispatch(setSelectedIndex(options.length - 1));
        }
        break;
      case 'Enter':
        if (selectedIndex > -1 && options[selectedIndex] && options[selectedIndex].onClick) {
          event.preventDefault();
          dispatch(onClick(options[selectedIndex]));
        }
        break;
      default:
        // Nothing
    }
  };
}

export function onMouseEnter() {
  return (dispatch, getState) => {
    const { expanded } = getState();
    if (expanded) {
      return;
    }

    dispatch(setExpanded(true));
  };
}

export function onMouseLeave() {
  return (dispatch, getState) => {
    const { expanded } = getState();
    if (!expanded) {
      return;
    }

    dispatch(setExpanded(false));
  };
}
