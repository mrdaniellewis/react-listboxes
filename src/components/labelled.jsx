import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import useId from '../hooks/use_id.js';
import joinTokens from '../helpers/join_tokens.js';

export function Labelled(props) {
  const { children, id: originalId, label, info, 'aria-describedby': originalDescribedBy } = props;
  const id = useId(originalId);
  const [el, ref] = useState(null);
  const [error, setError] = useState(null);
  const ariaDescribedBy = [
    `${id}_error`,
    originalDescribedBy,
    info && `${id}_info`,
  ];

  useEffect(() => {
    const findError = () => {
      let message = null;
      if (!el.validity.valid) {
        message = el.getCustomValidity();
      }
      setError(message);
    };
    el.addEventListener('invalid', findError, { passive: true });
    el.addEventListener('change', findError, { passive: true });
    el.addEventListener('blur', findError, { passive: true });

    return () => {
      el.removeEventListener('invalid', findError, { passive: true });
      el.removeEventListener('change', findError, { passive: true });
      el.removeEventListener('blur', findError, { passive: true });
    };
  }, [el]);

  return (
    <div>
      <label htmlFor={id}>
        {label}
        <abbr title="required">
          *
        </abbr>
      </label>
      {children({ id, ref, 'aria-describedby': joinTokens(...ariaDescribedBy) })}
      <div id={`${id}_error`}>
        {error}
      </div>
      {info && (
        <div id={`${id}_info`}>
          {info}
        </div>
      )}
    </div>
  );
}

Labelled.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node.isRequired,
  info: PropTypes.node.isRequired,
  'aria-describedby': PropTypes.string,
  children: PropTypes.func.isRequired,
};

Labelled.defaultProps = {
  id: null,
  'aria-describedby': null,
};
