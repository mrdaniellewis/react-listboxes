import React, { Fragment, forwardRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { classPrefix } from '../constants/class_prefix.js';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name.js';

export const ListBox = forwardRef(({ focusedRef, onSelectOption, ...props }, ref) => {
  const context = useContext(Context);
  const {
    currentOption,
    props: {
      options,
      ListBoxListComponent = 'ul', listBoxListProps,
      GroupComponent = Fragment, groupProps,
      GroupLabelComponent = 'li', groupLabelProps,
      OptionComponent = 'li', optionProps,
      ValueComponent, valueProps,
      VisuallyHiddenComponent, visuallyHiddenProps,
    },
  } = context;

  return (
    <ListBoxListComponent
      ref={ref}
      role="listbox"
      className={`${classPrefix}listbox`}
      onMouseDown={(e) => e.preventDefault()}
      {...props}
      {...listBoxListProps}
    >
      {renderGroupedOptions({
        options,
        renderGroup(group) {
          const { key, html, label, children: groupChildren } = group;
          return (
            <Context.Provider
              key={key}
              value={{ ...context, group }}
            >
              <GroupComponent
                {...groupProps}
              >
                <GroupLabelComponent
                  aria-hidden="true" // Prevent screen readers reading the wrong number of options
                  className={`${classPrefix}listbox__group-label`}
                  {...groupLabelProps}
                  {...html}
                >
                  {label}
                </GroupLabelComponent>
                {groupChildren}
              </GroupComponent>
            </Context.Provider>
          );
        },
        // eslint-disable-next-line react/prop-types
        renderOption(option) {
          const { label, key, html, disabled, group } = option;
          const selected = currentOption?.key === key;
          return (
            <Context.Provider
              key={key}
              value={{ ...context, selected, option, group }}
            >
              <OptionComponent
                id={key}
                role="option"
                className={`${classPrefix}listbox__option`}
                tabIndex={-1}
                aria-selected={selected ? 'true' : null}
                aria-disabled={disabled ? 'true' : null}
                ref={selected ? focusedRef : null}
                {...optionProps}
                {...html}
                onClick={disabled ? null : (e) => onSelectOption(e, option)}
              >
                {group && (
                  <VisuallyHiddenComponent
                    className={visuallyHiddenClassName}
                    {...visuallyHiddenProps}
                  >
                    {group.label}
                  </VisuallyHiddenComponent>
                )}
                <ValueComponent {...valueProps}>
                  {label}
                </ValueComponent>
              </OptionComponent>
            </Context.Provider>
          );
        },
      })}
    </ListBoxListComponent>
  );
});

ListBox.propTypes = {
  'aria-activedescendant': PropTypes.string,
  focusedRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onSelectOption: PropTypes.func.isRequired,
};

ListBox.defaultProps = {
  focusedRef: null,
  hidden: false,
  'aria-activedescendant': null,
};

ListBox.displayName = 'ListBox';
