# React combo box

An [aria combo box with manual selection](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) implemented in React.

## Select

This is a HTML `<select>`.
It is takes its options from an array, and onChange will be return the selected options value, rather than an event.
The `value` can be any object.

This is controlled component.  You must respond to `onChange` to update the selected value.

```js
<Select
  options={options}
  value={value}
  onChange={value => useValue(value)}
/>
```

| Prop               | Purpose                                          |
| ----               | ----                                             |
| blank              | Set a placeholder option                         |
| options            | An array of options.  See below.                 |
| value              | The `value` of the option to set                 |
| onChange           | Will be called with the value of selected option |
| Any other property | Will be added to the select element              |

### Options

Options is an array of either:
- strings
- numbers
- an array that destructures as `[value, label]`
- null or undefined - will be treated as an option with an empty label
- an object with the following properties:

| Prop               | Purpose                            |
| ----               | ----                               |
| value              | The value of the option            |
| label              | The label of the option            |
| group              | Group labels to generate optgroups |
| key                | If supplied, used as the react key |
| Any other property | Will be added to the option        |

## Dropdown

Produces a listbox opened by a button. It is equivalent to a HTML `<select>` element.

In ARIA terms, it is a `<button>` with a popup menu that opens a listbox.

This is a controlled component.  You must change the `value` in response to onChange to change the selection.
Unlike a select element, onChange is called immediately, and does not wait until the component is collapsed.

The interaction pattern is the same as the [aria practices collapsible dropdown example](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html)

```js
<Dropdown
  options={options}
  value={value}
  onChange={value => useValue(value)}
/>
```

| Prop        | Purpose                                          |
| ----        | ----                                             |
| blank       | Set a placeholder option                         |
| options     | An array of options.  See below.                 |
| value       | The `value` of the option to set                 |
| onChange    | Will be called with the value of selected option |
| onExpanded  | Called when opened                               |
| onCollapsed | Called when closed                               |
| Button      | Supply a custom button component                 |
| Listbox     | Supply a custom listbox component                |
| Option      | Supply a custom option component                 |

## Combo box

Produces a combo box using the ARIA 1.0 pattern.
This is a text box linked to list box.

This is a controlled component.  You must change the `options` in response to `onSearch`
and change the `value` in response to `onChange`.

```js
<ComboBox
  options={options}
  value={value}
  onChange={value => useValue(value)}
  onSearch={term => useTerm(term)}
/>
```

If the combo box shows a static list of options you can use the `<StaticComboBox>` component.
This will filter the list of items for you.

You can also use the `onSearch` hook if you want to build your own component.  See TODO for an example.

## TODO

- Move index to test folder
- Add searchTerm to state
- Display chosen value
- Should be possible to create a listbox without a textbox
- Add async search updating with busy
