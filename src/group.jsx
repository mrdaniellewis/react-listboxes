import React, { useContext } from 'react';
import { Context } from './context.js';
import { GroupName } from './group-name.jsx';

export function Group() {
  const {
    Group: RenderGroup,
  } = useContext(Context);

  return (
    <RenderGroup>
      <GroupName />
    </RenderGroup>
  );
}
