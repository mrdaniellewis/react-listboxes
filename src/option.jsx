import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Context } from './context.js';

export function Option({ index }) {
  const {
    selected,
    disabled,
    id,
    Option: RenderOption,
    Value: RenderValue,
  } = useContext(Context);

  return (
    <RenderOption
      aria-selected={selected ? 'true' : 'false'}
      aria-disabled={disabled || null}
      id={`${id}_listbox_${index}`}
      role="option"
      // onClick={(disabled || busy) ? null : e => this.onValueSelect(option, e)}
    >
      <RenderValue />
    </RenderOption>
  );
}

Option.propTypes = {
  index: PropTypes.number.isRequired,
};
