import { isValidElement, Fragment } from 'react';

export function dismemberComponent(component, defaultType = Fragment) {
  if (isValidElement(component)) {
    return component;
  }
  if (typeof component === 'string' || component === Fragment || typeof component === 'function' || typeof component?.render === 'function') {
    return { type: component };
  }
  return {
    props: component,
    type: defaultType,
  };
}
