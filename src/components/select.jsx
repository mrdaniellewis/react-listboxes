import React from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { dismemberComponent } from '../helpers/dismember_component.js';
import { componentCustomiser } from '../validators/component_customiser.js';

export function Select(rawProps) {
  const {
    options, setValue, selectedIndex, value: _,
    OptGroupComponent, OptionComponent, SelectComponent,
    ...props
  } = useNormalisedOptions(rawProps, { mustHaveSelection: true });

  const customOptGroupComponent = dismemberComponent(OptGroupComponent, 'optgroup');
  const customOptionComponent = dismemberComponent(OptionComponent, 'option');
  const customSelectComponent = dismemberComponent(SelectComponent, 'select');

  return (
    <customSelectComponent.type
      value={selectedIndex}
      onChange={({ target: { value: index } }) => setValue(options[+index]?.value ?? null)}
      {...customSelectComponent.props}
      {...props}
    >
      {renderGroupedOptions({
        options,
        renderGroup({ key, html, children, label }) { // eslint-disable-line react/prop-types
          return (
            <customOptGroupComponent.type
              key={key}
              label={label}
              {...customOptGroupComponent.props}
              {...html}
            >
              {children}
            </customOptGroupComponent.type>
          );
        },
        // eslint-disable-next-line react/prop-types
        renderOption({ label, key, html, disabled, index }) {
          return (
            <customOptionComponent.type
              value={index}
              key={key}
              disabled={disabled}
              {...customOptionComponent.props}
              {...html}
            >
              {label}
            </customOptionComponent.type>
          );
        },
      })}
    </customSelectComponent.type>
  );
}

Select.propTypes = {
  blank: PropTypes.node,
  setValue: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  OptionComponent: componentCustomiser,
  OptGroupComponent: componentCustomiser,
  SelectComponent: componentCustomiser,
};

Select.defaultProps = {
  blank: null,
  value: null,
  OptionComponent: null,
  OptGroupComponent: null,
  SelectComponent: null,
};
