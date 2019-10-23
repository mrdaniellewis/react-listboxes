import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Select } from '../src/components/select.jsx';

function trim(strings) {
  let spaces;
  return strings[0].replace(/^( +)(.*$)/mg, (m, s) => {
    if (spaces === undefined && m.trim()) {
      spaces = s.length;
    }
    return m.slice(spaces || 0);
  }).trim();
}

function SelectField({ label, ...props }) {
  const [value, setValue] = useState(null);
  const id = label.trim().toLowerCase().replace(/[^a-z]+/ig, '_').toLowerCase();
  return (
    <>
      <label htmlFor={id}>
        {label}
      </label>
      <div className="select">
        <Select
          id={id}
          value={value}
          setValue={setValue}
          {...props}
        />
      </div>
    </>
  );
}

SelectField.propTypes = {
  label: PropTypes.string.isRequired,
};

function Example() {
  return (
    <>
      <pre>
        <code className="language-js">
          {trim`
            const [value, setValue] = useState();

            <Select
              value={value}
              setValue={setValue}
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <SelectField
        label="Select"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
      />
      <pre>
        <code className="language-js">
          {trim`
            const [value, setValue] = useState();

            <Select
              value={value}
              setValue={setValue}
              options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
            />
          `}
        </code>
      </pre>
      <SelectField
        label="Grouped select"
        options={['Apple', 'Banana', 'Cherry', 'Mango', 'Ugli fruit']}
      />
    </>
  );
}

const container = document.createElement('div');
document.currentScript.after(container);
ReactDOM.render(
  <Example />,
  container,
);
