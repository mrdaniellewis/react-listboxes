import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_FOCUS_LIST_BOX } from './actions.js';

// AT RISK: It is debatable autoselect in this form is actually useful
function applyAutoselect(state, { type, ...params }, props) {
  const { autoselect } = props;

  if (!autoselect) {
    return state;
  }

  switch (type) {
    case SET_FOCUSED_OPTION:
    case SET_SEARCH: {
      const { options, lastKeyRef: { current: key }, findAutoselect } = props;
      const { focusListBox, search, inlineAutoselect } = state;

      if (focusListBox || !search || !params.autoselect) {
        break;
      }

      if (type === SET_SEARCH && key === 'Backspace' && inlineAutoselect) {
        return {
          ...state,
          focusedOption: null,
          inlineAutoselect: false,
          search: search.slice(0, -1),
        };
      }

      if (key === 'Backspace' || key === 'Delete') {
        return {
          ...state,
          focusedOption: null,
          inlineAutoselect: false,
        };
      }

      let focusedOption;
      for (let i = 0; i < options.length; i += 1) {
        const result = findAutoselect(options[i], search);
        if (result) {
          focusedOption = options[i];
          break;
        }
        if (result === false) {
          break;
        }
      }

      if (!focusedOption) {
        break;
      }

      const { inputRef: { current: { selectionStart } } } = props;

      return {
        ...state,
        focusedOption,
        inlineAutoselect: autoselect === 'inline' && selectionStart === search.length,
      };
    }
    default:
  }
  return {
    ...state,
    inlineAutoselect: false,
  };
}

function reduce(state, props, { type, ...params }) {
  switch (type) {
    case SET_SEARCH: {
      const { search } = params;
      const focusedOption = search ? state.focusedOption : null;
      return {
        ...state,
        search,
        focusedOption,
        expanded: true,
        focusListBox: false,
      };
    }
    case SET_EXPANDED: {
      const { expanded } = params;
      const { focusedOption } = state;
      const { selectedOption } = props;

      return {
        ...state,
        expanded,
        focusedOption: focusedOption ?? (expanded ? selectedOption : null),
      };
    }
    case SET_CLOSED:
      return {
        ...state,
        expanded: false,
        focusedOption: null,
        focusListBox: false,
        search: null,
      };
    case SET_FOCUSED_OPTION: {
      const {
        focusListBox = state.focusListBox,
        focusedOption,
      } = params;

      return {
        ...state,
        expanded: true,
        focusListBox: focusedOption ? focusListBox : false,
        focusedOption,
      };
    }
    case SET_FOCUS_LIST_BOX: {
      const {
        focusListBox,
      } = params;

      return {
        ...state,
        focusListBox,
      };
    }
    /* istanbul ignore next */
    default:
  }
  return state;
}

export function reducer(state, action, props) {
  const result = applyAutoselect(reduce(state, props, action), action, props);
  return result;
}
