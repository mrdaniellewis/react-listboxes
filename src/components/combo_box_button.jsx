import React, { setState, useLayoutEffect } from 'react';

export function ComboBoxButton() {
  const [expanded, setExpanded] = useState(false);
  const outerRef = useRef();
  const buttonRef = useRef();
  const comboBoxRef = useRef();

  const onClick = () => {
    setExpanded(!expanded);
  };

  const setValue = (value) => {
    originalSetValue(value);
    setExpanded(false);
    if (ref.current.contains(document.activeElement)) {
      buttonRef.current.focus();
    }
  };

  useLayoutEffect(() => {
    if (expanded) {
      comboBoxRef.focus();
    }
  }, [expanded]);

  return (
    <div
      ref={outerRef}
    >
      <button
        ref={buttonRef}
        type="button"
        role="combobox"
        onClick={onClick}
        aria-haspopup="listbox"
        aria-expanded={expanded ? 'true' : 'false'}
      >
        Open
      </button>
      <ComboBox
        ref={comboBoxRef}
        {...props}
      />
    </div>
  );
}
