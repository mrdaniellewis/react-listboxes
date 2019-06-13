import { useContext } from 'react';
import { Context } from './context.js';

export function Value() {
  const {
    option,
    pluckLabel,
    selected,
  } = useContext(Context);

  return pluckLabel(option) + (selected ? ' (selected)' : '');
}
