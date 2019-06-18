export function listNavigation({ event, open }) {
  const { altKey, metaKey, ctrlKey, key } = event;

  if (metaKey || ctrlKey) {
    return;
  }

  if (key === 'Escape') {
    // close
  }

  switch (key) {
    case 'ArrowUp':
      // Close if altKey, otherwise next item and show
      event.preventDefault();
      if (altKey) {
        // close
      } else {
        // select previous
      }
      break;
    case 'ArrowDown':
      // Show, and next item unless altKey
      event.preventDefault();
      if (!altKey) {
        // select next
      } else {
        // open
      }
      break;
    case 'Home':
      // First item
      if (open) {
        event.preventDefault();
        // select first
      }
      break;
    case 'End':
      // Last item
      if (open) {
        event.preventDefault();
        // select last
      }
      break;
    case 'Enter':
      // Select current item if one is selected
      event.preventDefault();
      if (open) {
        // select current
        // close
      }
      break;
    default:
  }
}
