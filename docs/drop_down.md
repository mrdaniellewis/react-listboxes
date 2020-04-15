# Drop down

A custom control that works like a HTML `<select>`.

This follows the ARIA 1.2 non-editable [combo box](https://w3c.github.io/aria-practices/#combobox)
design pattern.

> :warning: **Warning** the native `<select>` will be more accessible and easier to use on many devices.
>
> This control may be useful if options require complex styling.  However a radio group may also be more appropriate.
>
> There are significant differences between the way a `<select>` is represented with and interacted with
> on different devices and in different operating systems.  This control has to take a single approach and
> may confuse some users.
>
> It is also more cumbersome to add a label to this component.  The native `<label>` element _will not work_.
> Instead you will need to do the following:
>
> ```js
> <div id="label-id">My label</div>
> <DropDown
>  aria-labelledby="label-id"
>  {...moreProps}
> </DropDown>
> ```

## Usage

```js
const [value, setValue] = useState(initialValue);

<Dropdown
  options={options}
  value={value}
  onValue={setValue}
/>
```

This is a controlled component.  You must update `value` in response to `onValue`.

Unlike a regular `<select>` the value of this component will not be submitted with a form.
If you wish to submit the value add a `<input type="hidden" name="name" value="value" />` element.

## Props

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

## Customisation

A number of hooks are provided to customise the appearance of the component.

The `nameProps` props allow you to add your own attributes to each part, potentially overriding those already present.
This is a good way to add your own classes.

The `NameComponent` props allow you to replace or override each component.  Pass a lowercase string to change
the html element, or a full component if you want a more far reaching change.  Bear-in-mind you will have to
`forwardRef` for a number of the components.

```js
<WrapperComponent {...wrapperProps}>
  <ComboBoxComponent {...comboBoxProps} />
  <ListBoxComponent {...listBoxProps} >
    <ListBoxList {...listBoxListProps}>
      <OptionComponent {...optionProps}>
        <ValueComponent {...valueProps} />
      </OptionComponent>
      <GroupComponent {...groupProps}>
        <GroupLabelComponent {...groupProps} />
        <OptionComponent {...optionProps}>
          <VisuallyHiddenComponent {...visuallyHiddenProps} /> // contains the group name for screen readers
          <ValueComponent {...valueProps} />
        </OptionComponent>
      </GroupComponent>
    </ListBoxListComponent>
  </ListBoxComponent>
</WrapperComponent>
```

### Context

A context is provided to access the props and internal state of the control.  The properties are:

- `expanded` is the component expanded
- `activeOption` the currently active option
- `props` the props supplied to the component.

### Advanced options

#### `managedFocus` (`Boolean`)

By default this is `true`.  It means the browser focus follows the current selected option.

If `false` the combo box element remains focused and the current selected option is
marked with `aria-activedescendant`.  This method is found to have incomplete compatibility
with many screen-readers.

#### `skipOption` (`Function`)

This function can be used to skip an option when navigating with the arrow keys.

#### `findOption` (`Function`)

This function can be used to customise finding an option in response to keystrokes.
