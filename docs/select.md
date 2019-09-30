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
| Any other property | -          | Will be added to the select element |

## Options

Options is an array of either:
- `String`
- `Number`
- An array that destructures as `[key, label]`
- `null` or `undefined` - will be treated as a label with an empty string
- An array of groups of options
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

