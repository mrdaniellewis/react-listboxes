import { useEffect, useState } from 'react';

const reduceKeys = (keys, props) => {
  const ob = {};
  keys.forEach((key) => {
    ob[key] = props[key];
  });
  return ob;
};

const changed = (prev, current, keys) => {
  const ob = {};
  keys.forEach((key) => {
    if (current[key] !== prev[key]) {
      ob[key] = current[key];
    }
  });
  return ob;
};

export const useProps = (fn, props, keys) => {
  const reduced = reduceKeys(keys, props);
  const [prevProps, setProps] = useState(reduced);
  useEffect(() => {
    setProps(reduced);
    fn(changed(prevProps, reduced, keys));
  }, Object.values(reduced));
};
