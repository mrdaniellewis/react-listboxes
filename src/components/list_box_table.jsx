import React, { forwardRef, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Context } from '../context.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { classPrefix } from '../constants/class_prefix.js';
import { visuallyHiddenClassName } from '../constants/visually_hidden_class_name.js';

export const ListBoxTable = forwardRef(({ focusedRef, hidden, onSelectOption, ...props }, ref) => {
  const context = useContext(Context);
  const {
    currentOption,
    props: {
      columns: rawColumns,
      options,
      listBoxListProps,
      tableProps,
      tableHeaderProps,
      tableGroupHeaderProps,
      tableRowProps,
      tableCellProps,
      ValueComponent, valueProps,
      VisuallyHiddenComponent, visuallyHiddenProps,
    },
  } = context;

  const columns = useMemo(() => (
    rawColumns.map((column) => {
      if (typeof column === 'string') {
        return {
          name: column,
        };
      }
      return column;
    })
  ), [rawColumns]);

  return (
    <div
      hidden={hidden}
      className={`${classPrefix}listbox`}
      onMouseDown={(e) => e.preventDefault()}
      {...listBoxListProps}
    >
      <table
        ref={ref}
        role="listbox"
        {...props}
        className={`${classPrefix}listbox__table`}
        {...tableProps}
      >
        <colgroup>
          {columns.map(({ name, html }) => (
            <col key={name} {...html} />
          ))}
        </colgroup>
        {columns.some(({ label }) => label) && (
          <thead role="presentation">
            <tr>
              {columns.map(({ name, label }) => (
                <th
                  key={name}
                  className={`${classPrefix}listbox__table-header`}
                  {...tableHeaderProps}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody role="presentation">
          {renderGroupedOptions({
            options,
            renderGroup(group) {
              const { key, html, label, children: groupChildren } = group;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, group, columns }}
                >
                  <tr>
                    <th
                      colSpan={Object.keys(columns).length}
                      className={`${classPrefix}listbox__table-group-header`}
                      {...tableGroupHeaderProps}
                      {...html}
                    >
                      {label}
                    </th>
                  </tr>
                  {groupChildren}
                </Context.Provider>
              );
            },
            // eslint-disable-next-line react/prop-types
            renderOption(option) {
              const { key, html, disabled, group } = option;
              const selected = currentOption?.key === key;
              return (
                <Context.Provider
                  key={key}
                  value={{ ...context, selected, option, group, columns }}
                >
                  <tr
                    id={key}
                    role="option"
                    className={`${classPrefix}listbox__table-row`}
                    tabIndex={-1}
                    aria-selected={selected ? 'true' : null}
                    aria-disabled={disabled ? 'true' : null}
                    ref={selected ? focusedRef : null}
                    {...tableRowProps}
                    {...html}
                    onClick={disabled ? null : (e) => onSelectOption(e, option)}
                  >
                    {columns.map((column, index) => (
                      <Context.Provider key={column.name} value={{ ...context, column }}>
                        <td
                          role="presentation"
                          title={column.label || null}
                          className={`${classPrefix}listbox__table-cell`}
                          {...tableCellProps}
                        >
                          {group && index === 0 && (
                            <VisuallyHiddenComponent
                              className={visuallyHiddenClassName}
                              {...visuallyHiddenProps}
                            >
                              {group.label}
                            </VisuallyHiddenComponent>
                          )}
                          {column.label && (
                            <VisuallyHiddenComponent
                              className={visuallyHiddenClassName}
                              {...visuallyHiddenProps}
                            >
                              {column.label}
                            </VisuallyHiddenComponent>
                          )}
                          <ValueComponent
                            {...valueProps}
                          >
                            {option.value[column.name]}
                          </ValueComponent>
                        </td>
                      </Context.Provider>
                    ))}
                  </tr>
                </Context.Provider>
              );
            },
          })}
        </tbody>
      </table>
    </div>
  );
});

ListBoxTable.propTypes = {
  'aria-activedescendant': PropTypes.string,
  focusedRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  hidden: PropTypes.bool,
  id: PropTypes.string.isRequired,
  onSelectOption: PropTypes.func.isRequired,
};

ListBoxTable.defaultProps = {
  focusedRef: null,
  hidden: false,
  'aria-activedescendant': null,
};

ListBoxTable.displayName = 'ListBoxTable';
