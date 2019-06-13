export const SELECT_NEXT = 'SELECT_NEXT';
export const SELECT_PREVIOUS = 'SELECT_PREVIOUS';
export const SELECT_LAST = 'SELECT_LAST';
export const SELECT_FIRST = 'SELECT_FIRST';
export const CLOSE_LIST_BOX = 'CLOSE_LIST_BOX';
export const OPEN_LIST_BOX = 'OPEN_LIST_BOX';
export const INPUT_FOCUS = 'INPUT_FOCUS';
export const COMPONENT_BLUR = 'COMPONENT_BLUR';
export const PROP_CHANGE = 'PROP_CHANGE';
export const OPEN_LISTBOX = 'OPEN_LISTBOX';
export const CLOSE_LISTBOX = 'CLOSE_LISTBOX';

export const selectNext = fromIndex => ({ type: SELECT_NEXT, fromIndex });
export const selectPrevious = fromIndex => ({ type: SELECT_PREVIOUS, fromIndex });
export const selectLast = () => ({ type: SELECT_LAST });
export const selectFirst = () => ({ type: SELECT_FIRST });

export const inputFocus = () => ({ type: INPUT_FOCUS });
export const componentBlur = () => ({ type: COMPONENT_BLUR });
export const openListbox = () => ({ type: OPEN_LISTBOX });
export const closeListbox = () => ({ type: CLOSE_LISTBOX });

export const propChange = props => ({ type: PROP_CHANGE, ...props });

export const inputChange = ({ event: { target: { value } } }) => (
  dispatch,
  state,
  { onChange },
) => {
  dispatch(openListbox());
  onChange(value);
};

export const inputKeyDown = ({ event, event: { altKey, metaKey, ctrlKey, key } }) => (
  dispatch,
  { busy, open, options, selectedIndex },
  { onChange },
) => {
  if (metaKey || ctrlKey) {
    return;
  }

  if (key === 'Escape') {
    event.preventDefault();
    onChange(null, event);
    dispatch(closeListbox());
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
        dispatch(closeListbox());
      } else {
        dispatch(selectPrevious(selectedIndex));
      }
      break;
    case 'ArrowDown':
      // Show, and next item unless altKey
      event.preventDefault();
      if (!altKey) {
        dispatch(selectNext(selectedIndex));
      } else {
        dispatch(openListbox());
      }
      break;
    case 'Home':
      // First item
      if (open) {
        event.preventDefault();
        dispatch(selectFirst());
      }
      break;
    case 'End':
      // Last item
      if (open) {
        event.preventDefault();
        dispatch(selectLast());
      }
      break;
    case 'Enter':
      // Select current item if one is selected
      event.preventDefault();
      if (open && selectedIndex !== null) {
        onChange(options[selectedIndex], event);
        dispatch(closeListbox());
      }
      break;
    default:
  }
};
