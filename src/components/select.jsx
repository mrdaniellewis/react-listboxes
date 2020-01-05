import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { useNormalisedOptions } from '../hooks/use_normalised_options.js';
import { renderGroupedOptions } from '../helpers/render_grouped_options.js';
import { dismemberComponent } from '../helpers/dismember_component.js';
import { componentCustomiser } from '../validators/component_customiser.js';

export function Select(rawProps) {
  const {
    options, onChange, onValue, selectedIndex, value: _,
    OptGroupComponent, OptionComponent, SelectComponent,
    ...props
  } = useNormalisedOptions(rawProps, { mustHaveSelection: true });

  const customOptGroupComponent = dismemberComponent(OptGroupComponent, 'optgroup');
  const customOptionComponent = dismemberComponent(OptionComponent, 'option');
  const customSelectComponent = dismemberComponent(SelectComponent, 'select');

  const handleChange = useCallback((e) => {
    onValue(options.find((o) => o.identity === e.target.value)?.value ?? null);
    onChange(e);
  }, [onValue, onChange, options]);

  return (
    <customSelectComponent.type
      value={options[selectedIndex]?.identity ?? ''}
      onChange={handleChange}
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
        renderOption({ identity, label, key, html, disabled }) {
          return (
            <customOptionComponent.type
              value={identity}
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
  onChange: PropTypes.func,
  onValue: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.any).isRequired,
  value: PropTypes.any,
  OptionComponent: componentCustomiser,
  OptGroupComponent: componentCustomiser,
  SelectComponent: componentCustomiser,
};

Select.defaultProps = {
  blank: null,
  value: null,
  onChange: () => {},
  onValue: () => {},
  OptionComponent: null,
  OptGroupComponent: null,
  SelectComponent: null,
};
