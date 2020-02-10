import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_LIST_PROPS, SET_ARIA_BUSY } from './actions.js';

// AT RISK: It is debatable autocomplete in this form is actually useful
function applyAutocomplete(state, { type, ...params }, props) {
  const { autoComplete } = props;

  if (!autoComplete || type === SET_ARIA_BUSY) {
    return state;
  }

  switch (type) {
    case SET_FOCUSED_OPTION:
    case SET_SEARCH: {
      const { options, lastKeyRef: { current: key }, findAutoComplete } = props;
      const { focusListBox, search, inlineAutoComplete } = state;

      if (focusListBox || !search || !params.autoComplete) {
        break;
      }

      if (type === SET_SEARCH && key === 'Backspace' && inlineAutoComplete) {
        return {
          ...state,
          focusedOption: null,
          inlineAutoComplete: false,
          search: search.slice(0, -1),
        };
      }

      if (key === 'Backspace' || key === 'Delete') {
        return {
          ...state,
          focusedOption: null,
          inlineAutoComplete: false,
        };
      }

      let focusedOption;
      for (let i = 0; i < options.length; i += 1) {
        const result = findAutoComplete(options[i], search);
        if (result === true) {
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
        inlineAutoComplete: autoComplete === 'inline' && selectionStart === search.length,
      };
    }
    default:
  }
  return {
    ...state,
    inlineAutoComplete: false,
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

      return {
        ...state,
        expanded,
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
    case SET_LIST_PROPS: {
      const { listStyle, listClassName } = params;
      return {
        ...state,
        listStyle,
        listClassName,
      };
    }
    case SET_ARIA_BUSY: {
      const { ariaBusy } = params;
      if (ariaBusy === state.ariaBusy) {
        return state;
      }
      return {
        ...state,
        ariaBusy,
      };
    }
    /* istanbul ignore next */
    default:
  }
  return state;
}

export function reducer(state, action, props) {
  const result = applyAutocomplete(reduce(state, props, action), action, props);
  return result;
}
