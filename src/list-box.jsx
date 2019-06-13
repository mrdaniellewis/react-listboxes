import React, { useContext } from 'react';
import { Context } from './context.js';
import { Group } from './group.jsx';
import { Option } from './option.jsx';

export function ListBox() {
  const state = useContext(Context);
  const {
    id,
    options,
    selectedIndex,
    open,
    pluckDisabled,
    pluckGroup,
    pluckIdentity,
    ListBox: RenderListBox,
  } = state;

  let prevGroup = null;

  return (
    <RenderListBox
      id={`${id}_listbox`}
      role="listbox"
      hidden={!(open && options.length)}
      onMouseDown={e => e.preventDefault()}
      tabIndex={-1}
    >
      {options && options.map((option, index) => {
        const disabled = pluckDisabled(option);
        const selected = index === selectedIndex;
        const group = pluckGroup(option) || null;
        const newGroup = group !== prevGroup;
        prevGroup = group;
        return (
          <Context.Provider
            key={pluckIdentity(option)}
            value={{ ...state, option, disabled, selected }}
          >
            {group && newGroup && (
              <Group />
            )}
            <Option index={index} />
          </Context.Provider>
        );
      })}
    </RenderListBox>
  );
}
