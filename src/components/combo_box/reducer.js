import { SET_SEARCH, SET_EXPANDED, SET_CLOSED, SET_FOCUSED_OPTION, SET_LIST_PROPS } from './actions.js';

function applyAutocomplete(state, props) {
  const { search, focusListBox } = state;
  const { options, autoComplete, lastKeyRef: { current: key } } = props;

  if (!autoComplete || focusListBox || !search) {
    return state;
  }

  if (key === 'Backspace' || key === 'Delete') {
    return {
      ...state,
      focusedOption: null,
    };
  }

  let { focusedOption } = state;
  if (autoComplete && !focusListBox && search) {
    for (let i = 0; i < options.length; i += 1) {
      if (!options[i].unselectable) {
        if (options[i].label.toLowerCase().startsWith(search.toLowerCase())) {
          focusedOption = options[i];
        }
        break;
      }
    }
  }

  return {
    ...state,
    focusedOption,
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
        focusListBox: false,
        search: null,
        autoComplete: false,
        inlineAutoComplete: false,
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

    default:
      throw new Error(`${type} unknown`);
  }
}

export function reducer(state, props, action) {
  console.log(action);
  const result = applyAutocomplete(reduce(state, props, action), props);
  console.log(result);
  return result;
}
