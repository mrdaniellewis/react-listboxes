# Drop down

A custom control that works like a HTML `<select>`.

This follows the ARIA 1.2 read-only [combo box](https://w3c.github.io/aria-practices/#combobox)
design pattern.

## Warning

The native `<select>` will be more accessible and easier to use on many devices.

This control may be useful if options require complex styling.  However a radio group may also be more appropriate.

There are significant differences between the way a `<select>` is represented with and interacted with
on different devices and in different operating systems.  This control has to take a single approach and
may confuse some users.

It is also more cumbersome to add a label to this component.  The native `<label>` element _will not work_.
Instead you will need to do the following:

```js
<div id="label-id">My label</div>
<DropDown
  aria-labelledby="label-id"
  {...moreProps}
</DropDown>
```

## Usage

```js
const [value, setValue] = useState(initialValue);

<Dropdown
  options={options}
  value={value}
  setValue={setValue}
/>
```

This is a controlled component.  You must update `value` in response to `setValue`.

Unlike a regular `<select>` the value of this component will not be submitted with a form.
If you wish to submit the value add a `<input type="hidden" name="name" value="value" />` element.

### Basic options

| Prop              | Type       | Purpose                                                   |
| ----              | ----       | ----                                                      |
| `aria-labelledby` | `string`   | Specify the id of the label of the control                |
| `aria-invalid`    | `string`   | Specify the validity state of the control                 |
| `blank`           | `String`   | Set a placeholder option                                  |
| `children`        | `Node`     | Will override the displayed value of the combo box        |
| `id`              | `String`   | id of the component                                       |
| `options`         | `Array`    | The set of options.  See options.                         |
| `value`           | `Any`      | The currently selected option                             |
| `onValue`         | `Function` | Callback will be called with the selected option onChange |
| `mapOption`       | `Function` | Use to map options. See options                           |
| `ref`             |            | Will be passed to combo box  element                      |
| `disabled`        | `Boolean`  | Make the control disabled                                 |
| `required`        | `Boolean`  | Mark the control as required (sets `aria-required`        |

#### Options

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

<DropDown
  options={options}
  value={value}
  setValue={setValue}
  mapOption={mapOption}
/>
```

### Customisation

A number of hooks are provided to customise the appearance of the component.

The component has the following layout:

```html
<wrapper>
  <combobox />
  <listbox>
    <option>
      <value />
    </option>
    <group>
      <groupLabel />
      <option>
        <value />
      </option>
    </group>
  </listbox>
</wrapper>
```

#### `classNames` (`Object`)

An object whose key value pairs set the various class names used for the component parts and some component states.

By default a [BEM style naming convention](https://en.bem.info/methodology/quick-start/#introduction) is used.

The keys are:

- `wrapper`
- `combobox`
- `listbox`
- `groupLabel`
- `option`
- `optionSelected` - an option that is currently selected
- `optionGrouped` - an option that is part of a group
- `optionSelectedGrouped` - an option that is selected and part of a group
- `visuallyHidden` - an element that is hidden, but visible to a screen-reader.  Used to prefix options with group names.

#### Components

Each component can be replaced using a `NameComponent` prop.  Some components will need to forward their refs.

- `WrapperComponent = 'div'`
- `ComboBoxComponent = 'div'` - forwards ref
- `ListBoxComponent = 'ul'` - forwards ref
- `GroupComponent = Fragment` **Warning** This allows an ARIA 1.2 groups to be implemented, but they are not compatible with most screen-readers.  Avoid settings this.
- `GroupLabelComponent = 'li'`
- `OptionComponent = 'li'` - forwards ref
- `ValueComponent = Fragment`

Each component can be given additional props using a `nameProps` prop.

- `wrapperProps`
- `comboBoxProps`
- `listBoxProps`
- `groupProps`
- `groupLabelProps`
- `optionProps`
- `valueProps`

#### Context

A context is provided to access the props and internal state of the control.

### Advanced options

#### `managedFocus` (`Boolean`)

By default this is `true`.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is
marked with `aria-activedescendant`.  This method is found to have incomplete compatibility
with many screen-readers.

### `skipOption` (`Function`)

This function can be used to skip an option when navigating with the arrow keys.

### `findOption` (`Function`)

This function can be used to customise finding an option in response to keystrokes.
