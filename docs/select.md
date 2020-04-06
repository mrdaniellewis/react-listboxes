# Select

Generates an HTML `<select>`, but with a more convenient way of setting the options and responding to changed values.

This uses the same options as `<DropDown>` and `<ComboBox>` and maybe used interchangeably.

## Warning

Many users find `<select>` controls difficult to use.  A radio group may be more appropriate.

## Usage

This is a stateless controlled component.  You must respond to `onValue` or `onChange` to update the selected value.

```js
const [value, setValue] = useState(initialValue);

<Select
  options={options}
  value={value}
  onValue={setValue}
/>
```

| Prop               | Type       | Purpose                                                   |
| ----               | ----       | ----                                                      |
| `blank`            | `String`   | Set a placeholder option                                  |
| `options`          | `Array`    | The set of options.  See options.                         |
| `value`            | `Any`      | The currently selected option                             |
| `onValue`          | `Function` | Callback will be called with the selected option onChange |
| `mapOption`        | `Function` | Use to map options. See options                           |
| `optionProps`      | `Object`   | Props to add to all `<option>` elements                   |
| `optGroupProps`    | `Object`   | Props to add to all `<optgroup>` elements                 |
| `ref`              |            | Will be passed to `<select>` element                      |
| Any other property |            | Will be added to the `<select>` element                   |

### Options

Options is an array of either:

- `String`
- `Number`
- `null` or `undefined` - will be treated as an empty string
- an object with the following properties:

| Prop               | Type      | Purpose                                              |
| ----               | ----      | ----                                                 |
| `label`            | `String`  | The label of the option (required)                   |
| `disabled`         | `Boolean` | Is the option disabled                               |
| `group`            | `String`  | Label to group options under                         |
| `value`            | `Object`  | Object value used to compare options                 |
| `id`               | `Object`  | Fallback value used to compare options               |
| `html`             | `Object`  | Additional html attributes to be added to the option |
| Any other property |           | Ignored                                              |

When an option is selected `onValue` will be called with the selected option.

When determining which option is selected the option and `value` is compared
by converting to a string value using the equivalent of
`String(option?.value ?? option?.id ?? option?.label ?? option ?? '')`.

If your option does not match the above signature, you can use `mapOption` to match the signature.

```js
const [value, setValue] = useState(initialValue);

const mapOption = useCallback(({ name, deleted }) => {
  return {
    label: name,
    disabled: deleted,
  };
}, []);

<Select
  options={options}
  value={value}
  setValue={setValue}
  mapOption={mapOption}
/>
```
