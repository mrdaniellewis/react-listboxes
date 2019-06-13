import { useContext } from 'react';
import { Context } from './context.js';

export const GroupName = () => {
  const {
    option,
    pluckGroup,
  } = useContext(Context);

  return pluckGroup(option);
};
