function calculateMaxWidth(listbox, selector) {
  listbox.style.maxWidth = ''; // eslint-disable-line no-param-reassign
  const contained = listbox.closest(selector) || document.body;
  const computed = window.getComputedStyle(contained);
  const padRight = parseFloat(computed.paddingRight)
    + parseFloat(computed.marginRight)
    + parseFloat(computed.borderRight);
  const listboxBounding = listbox.getBoundingClientRect();
  return `${contained.getBoundingClientRect().right - padRight - listboxBounding.left}px`;
}

function calculateMaxHeight(listbox) {
  listbox.style.maxHeight = ''; // eslint-disable-line no-param-reassign
  const listboxBounding = listbox.getBoundingClientRect();
  const windowEnd = window.innerHeight;
  let bodyEnd = 0;
  // IE11 extends the body do we need to find the last child
  Array.from(document.body.children).forEach((el) => {
    bodyEnd = Math.max(bodyEnd, el.getBoundingClientRect().bottom);
  });
  if (listboxBounding.bottom > windowEnd) {
    const newHeight = listboxBounding.height
      - (listboxBounding.bottom - Math.max(windowEnd, bodyEnd))
      - 10;
    const stylesheetMaxHeight = parseFloat(window.getComputedStyle(listbox).maxHeight);
    const maxHeight = Math.max(newHeight, 0);
    if (!stylesheetMaxHeight || maxHeight < stylesheetMaxHeight) {
      return `${maxHeight}px`;
    }
  }
  return '';
}

export function confine(selector) {
  return ({ listbox }) => ({
    style: {
      maxWidth: calculateMaxWidth(listbox, selector),
      maxHeight: calculateMaxHeight(listbox),
    },
  });
}
