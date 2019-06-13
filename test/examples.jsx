import React from 'react';
import { SelectField } from './select_field.jsx';

export function Examples() {
  return (
    <>
      <SelectField
        label="Numbers"
        options={[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]}
      />
      <SelectField
        label="Strings"
        options={['Foo', 'Bar', 'Foe', 'Fee']}
      />
      <SelectField
        label="Arrays"
        options={[['foo', 'Foo'], ['bar', 'Bar'], ['foe', 'Foe'], ['fee', 'Fee']]}
      />
      <SelectField
        label="Objects"
        options={[
          {
            label: 'Foo',
            value: 1,
          },
          {
            label: 'Boo',
            value: 2,
            disabled: true,
          },
          {
            label: 'Foe',
            value: 3,
          },
        ]}
      />
    </>
  );
}
