# Select

An HTML `<select>`.

This uses the same options as `<DropDown>` and `<ComboBox>` and maybe used interchangeably.

This is a stateless controlled component.  You must respond to `setValue` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Select
  options={options}
  value={value}
  setValue={value => setValue(value)}
/>
```

| Prop               | Type       | Purpose                             |
| ----               | ----       | ----                                |
| blank              | `String`   | Set a placeholder option            |
| options            | `Array`    | The set of options.  See options.   |
| value              | `Any`      | The currently selected option       |
| setValue           | `Function` | Callback when the option changes    |
| mapOption          | `Function` | Use to map options values           |
| Any other property | -          | Will be added to the select element |

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
| node     | Node          | Displayed instead of the label in a list of options                       |
| html     | Object        | Additional html attributes to add                                         |

