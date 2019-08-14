import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { ComboBox } from '../src/components/combo_box/index.jsx';
import { useAsyncSearch } from '../src/hooks/use_async_search.js';
import { options as validateOptions } from '../src/validators/options.js';
import { makeSearch } from '../src/helpers/make_search.js';
import fruits from './fruits.json';
import { TokenHighlight } from '../src/components/highlight/token_highlight.jsx';

export function AsyncComboBoxField({ label, ...props }) {
  const { value: initialValue, options: initialOptions } = props;
  const [value, setValue] = useState(initialValue);
  const [search] = useState(() => makeSearch(fruits));
  const { options, busy, onSearch, error } = useAsyncSearch(
    async (query) => {
      if (query === 'fail') {
        throw new Error('failure');
      }
      await new Promise(resolve => setTimeout(resolve, Math.random() * 3000));
      return search(query);
    },
    initialOptions,
  );
  const id = label.trim().replace(/[^a-z]+/ig, '_').toLowerCase();

  return (
    <>
      <label htmlFor={id} id={`${id}_label`}>
        {label}
      </label>
      <ComboBox
        id={id}
        labelId={`${id}_label`}
        {...props}
        options={options}
        value={value}
        busy={busy}
        setValue={setValue}
        onSearch={onSearch}
        notFoundMessage={error}
        ValueComponent={TokenHighlight}
      />
    </>
  );
}

AsyncComboBoxField.propTypes = {
  options: validateOptions.isRequired,
  value: PropTypes.any, // eslint-disable-line react/forbid-prop-types
  label: PropTypes.string.isRequired,
};

AsyncComboBoxField.defaultProps = {
  value: null,
};
