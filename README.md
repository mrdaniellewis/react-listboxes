# React combo box

An [aria combo box with manual selection](https://www.w3.org/TR/wai-aria-practices-1.1/#combobox) implemented in React.

## Select

This is a HTML `<select>`.
The principle difference it is takes its options from an array, and return and is set by the option `value`.

This is controlled component.  You must respond to `onChange` to update the selected value.

```js
<Select
  options={options}
  value={value}
  onChange={value => useValue(value)}
/>
```

| Prop               | Purpose                                     |
| ----               | ----                                        |
| blank              | Set a placeholder option                    |
| options            | An array of options.  See below.            |
| value              | The `value` of the option to set            |
| onChange           | Will be called with the value of set option |
| Any other property | Will be added to the select element         |

### Options

Options is an array of either:
- strings
- numbers
- an array that destructures as `[value, label]`
- null or undefined - will be treated as an option with an empty label
- an object with the following properties:

| Prop     | Purpose                                           |
| ----     | ----                                              |
| value    | The value of the option                           |
| label    | The label of the option                           |
| disabled | Is the option disabled                            |
| group    | Group labels to generate optgroups                |
| id       | If supplied, value matching will be based on this |
| key      | If supplied, used as the react key                |

## Listbox

Produces a listbox.  This is equivalent to a HTML `<select>`.
That is `<button>` that opens a static list of options.

This is a controlled component.  You must change the `value` in response to onChange to change the selection.

An option will be selected in response to:
| Key                  | Function                                                    |
| ----                 | ----                                                        |
| Down                 | Move down an item                                           |
| Up                   | Move up an item                                             |
| Home                 | Move to first item                                          |
| End                  | Move to last item                                           |
| Printable characters | Move to the item starting with that character or characters |
| Escape               | Close list box                                              |
| Enter                | Close list box                                              |

```js
<Listbox
  options={options}
  value={value}
  onChange={value => useValue(value)}
/>
```

## Combo box

Produces are combo box using the ARIA 1.0 pattern.
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
