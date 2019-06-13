import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { StateInspector } from 'reinspect';
import { Core } from './core.jsx';
import { useSearch } from './hooks/use-search.js';

const App = ({ collection, ...props }) => {
  const [options, onSearch] = useSearch(collection);
  const [value, setValue] = useState(null);
  return (
    <Core
      options={options}
      onSearch={onSearch}
      value={value}
      onChange={newValue => setValue(newValue)}
      {...props}
    />
  );
};

App.propTypes = {
  collection: PropTypes.arrayOf(PropTypes.object).isRequired,
};

const container = document.createElement('div');
document.body.appendChild(container);
ReactDOM.render(
  <StateInspector name="Core">
    <App id="foo" collection={[{ id: 1, label: 'foo' }, { id: 2, label: 'bar' }, { id: 3, label: 'fee' }, { id: 4, label: 'fi' }]} />
  </StateInspector>,
  container,
);
