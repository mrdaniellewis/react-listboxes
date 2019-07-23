# React components

A set of react components based on [WAI-ARIA Authoring Practices](https://www.w3.org/TR/wai-aria-practices-1.1/).

```
import { Component } from '@citizensadvice/react-components';
```

## Development

To start `npm start`  
To test `npm test`
To build example page `npm run build`
To deploy the example page `npm run gh-pages`

You can use [Redux Dev Tools](https://github.com/zalmoxisus/redux-devtools-extension) to debug the state of most components.

## Components

### Select

This is a HTML `<select>`.  Unlike a standard react `<select>` it takes the options from an array
and calls `setValue` with an object rather than a string.

This is stateless controlled component.  You must respond to `setValue` to update the selected value.

```js
<Select
  options={options}
  value={value}
  setValue={value => useValue(value)}
/>
```

| Prop               | Purpose                                          |
| ----               | ----                                             |
| blank              | Set a placeholder option                         |
| options            | An array of options.  See below.                 |
| value              | The `value` of the option to set                 |
| setValue           | Will be called with the value of selected option |
| Any other property | Will be added to the select element              |

#### Options

Options is an array of either:
- strings
- numbers
- an array that destructures as `[value, label]`
- null or undefined - will be treated as an option with an empty label
- an object with the following properties:

| Prop               | Purpose                                |
| ----               | ----                                   |
| value              | The value of the option                |
| label              | The label of the option                |
| group              | Group labels to generate `<optgroup>`s |
| key                | If supplied, used as the react key     |
| Any other property | Will be added to the option            |

### Drop down

Produces a listbox opened by a button. It is equivalent to a custom HTML `<select>` element.

In ARIA terms, it is a `<button>` `aria-haspopup` of `menu` that opens a listbox.

The interaction pattern is the same as the [aria practices collapsible dropdown example](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html)

This is a controlled component.  You must change the `value` in response to `setValue` to change the selection.
The component maintains an internal state to control if opened or closed. 

```js
<Dropdown
  options={options}
  value={value}
  setValue={value => useValue(value)}
/>
```

| Prop        | Purpose                                          |
| ----        | ----                                             |
| blank       | Set a placeholder option                         |
| options     | An array of options.  See below.                 |
| value       | The `value` of the option to set                 |
| setValue    | Will be called with the value of selected option |
| onToggle    | Called when opened or closed                     |
| Button      | Supply a custom button component                 |
| Listbox     | Supply a custom listbox component                |
| Option      | Supply a custom option component                 |

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

- Drop down
  - Use comboxbox searcher
  - Customisation
  - Add positioning
  - Click on label
- Combo box
  - aria-active descendant is where the focus is - not the current value
  - first draw do not show items
  - drop down button
  - with async search 
    - busy
  - Highlighters
  - aria 1.0
  - autocomplete types
