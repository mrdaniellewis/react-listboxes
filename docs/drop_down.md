# Drop down

A custom control that works like a HTML `<select>`.

This follows the [Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox)
design pattern.  This is a button that opens a list box.

Warning: the native `<select>` will be more accessible and easier to use on 
many devices.

Note that there are significant differences between a `<select>` on a Mac and on
Windows.  This control uses different aria roles depending on whether the user is on a Mac or Windows.

Windows:

- The button has a role of `combobox` with `has-popup=listbox`.
- The listbox has a role of `listbox`.
- Escape closes the listbox, and sets the current selection.

Mac

- The button is a menu button, that is, has a role of button with `has-popup=menu`.
- The listbox has a role of `menu`.
- Escape closes the listbox and cancels the current selection.

```js
const [value, setValue] = useState(initialValue);

<Dropdown
  options={options}
  value={value}
  setValue={value => setValue(value)}
/>
```

This is a controlled component.  You must update `value` in response to `setValue`.

| Prop               | Type       | Purpose                                                                          |
| ----               | ----       | ----                                                                             |
| id                 | `String`   | ID of the control, defaults to a unique generated id                             |
| blank              | `String`   | Set a placeholder option                                                         |
| children           | React node | If supplied, is the contents of the button.  Otherwise the current label is used |
| options            | `Array`    | The set of options.  See options.                                                |
| value              | `Any`      | The currently selected option                                                    |
| setValue           | `Function` | Callback when the option changes                                                 |
| mapOption          | `Function` | Use to map options values                                                        |
| platform           | `String`   | defaults to mac or windows depending on the user agent                           |
| Any other property | -          | Will be added to the select element                                              |

## Options

Options is an array of either:
- `String`
- `Number`
- `null` or `undefined` - will be treated as a label with an empty string
- an object with the following properties:

| Prop     | Type          | Purpose                                                                   |
| ----     | ----          | ----                                                                      |
| label    | String/Number | The label of the option (required)                                        |
| disabled | Boolean       | Is the option disabled                                                    |
| group    | String        | Label to group options under                                              |
| value    | Object        | Object value used to compare options.  Defaults to `value ?? id ?? label` |
| id       | Object        | Fallback value used to compare options                                    | 
| html     | Object        | Additional html attributes to add                                         |
