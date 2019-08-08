** WORK IN PROGRESS **

# React components

A set of react components based on [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/).

```
import { Component } from '@citizensadvice/react-components';
```

This uses the following Babel plugins:

* `@babel/plugin-proposal-nullish-coalescing-operator`
* `@babel/plugin-proposal-optional-chaining`


## Development

To start `npm start`  
To test `npm test`
To build example page `npm run build`
To deploy the example page `npm run deploy`

You can use [Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension) to debug the state of most components.

## Components

### Select

A HTML `<select>`.

This uses the same options as `<DropDown>` and `<ComboBox>` and can use used interchangeably.

This is stateless controlled component.  You must respond to `setValue` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Select
  options={options}
  value={value}
  setValue={value => setValue(value)}
/>
```

| Prop               | Type     | Purpose                             |
| ----               | ----     | ----                                |
| blank              | String   | Set a placeholder option            |
| options            | Array    | The set of options.  See below.     |
| value              | Any      | The currently selected option       |
| setValue           | Function | Callback when the option changes    |
| Any other property | -        | Will be added to the select element |

#### Options

Options is an array of either:
- strings
- numbers
- an array that destructures as `[key, label]`
- null or undefined - will be treated as a label with an empty string
- an array of groups of options
- an object with the following properties:

| Prop               | Type          | Purpose                                                                        |
| ----               | ----          | ----                                                                           |
| label              | String/Number | The label of the option (required)                                             |
| disabled           | Boolean       | Is the option disabled                                                         |
| group              | As an option  | Group the options                                                              |
| value              | Object        | Used to compare `value` to the option.  Will default to `value ?? id ?? label` |
| data               | Any           | This key is ignored and can store custom data                                  |
| node               | Node          | Displayed instead of the label in a list of options                            |
| options            | Array         | If preset the option will be treated as a group                                |
| Any other property | -             | Will be added to the React option                                              |

### Drop down

Produces a listbox opened by a button. It is equivalent to a custom HTML `<select>` element.

In ARIA terms, it is a `<button>` `aria-haspopup` of `menu` that opens a listbox.

The interaction pattern is the same as the [aria practices collapsible dropdown example](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html).

This is a controlled component.  You must respond to `setValue` to change the selection.

```js
const [value, setValue] = useState(initialValue);

<Dropdown
  options={options}
  value={value}
  setValue={value => setValue(value)}
/>
```

| Prop        | Purpose                                          |
| ----        | ----                                             |
| blank       | Set a placeholder option                         |
| options     | An array of options.  See below.                 |
| value       | The `value` of the option to set                 |
| setValue    | Will be called with the value of selected option |
| onToggle    | Called when opened or closed                     |

### Combo box

Produces a combo box using the ARIA 1.0 pattern.
This is a text box linked to list box.

This is a controlled component.  You must change the `options` in response to `onSearch` and change the value in response to `setValue`.

```js
<ComboBox
  options={options}
  value={value}
  onChange={value => useValue(value)}
  onSearch={term => useTerm(term)}
/>
```

#### Searches

You must change the list of options in response on `onSearch`.  For a static list of options a hook is provided to help you.

#### Highlight

It is often desired to highlight the search results.


### PopupButton
### ComboBoxButton
### Tree

## TODO

- drop down
  - fix group key
  - fix opening with invalid value
- combo box
  - consolidate list box
  - update to use new options 
  - update validator
- menu
  - auto open don't close on click
- auto-id
- showing loader on delete?
- errors if ref is missing
- remove regenerator now babelrc is fixed
- tab trapped in ie11 on button
- do not label button (ie11)
- ie11 only reading "clear" on clear button
- labelledby passthrough
- describedby passthough
- do we still need data-focused?
- class name generation
- Styling
- Positioning
- Menu button
  - dividers
- Combo box
  - Aria 1.1 sample
  - Click / hover styling
  - Drop down button styling
  - Close button styling
  - Loading button styling
  - Telephone highlighter
  - HTML highlighter
  - autocomplete types
