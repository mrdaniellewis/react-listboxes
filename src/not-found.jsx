import React, { useContext } from 'react';
import { Context } from './context.js';

export function NotFound() {
  const {
    id,
    notFoundMessage,
    NotFound: RenderNotFound,
    open,
    options,
  } = useContext(Context);

  return (
    <RenderNotFound
      id={`${id}_not-found`}
      aria-live="polite"
      hidden={!(open && !options.length)}
      role="alert"
    >
      {notFoundMessage}
    </RenderNotFound>
  );
}
