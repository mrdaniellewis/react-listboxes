export const initialState = ({ busy, options, pluckDisabled, pluckIdentity }) => ({
  busy,
  focused: false,
  options,
  open: false,
  pluckDisabled,
  pluckIdentity,
  searchTerm: '',
  selectedIndex: null,
  value: null,
});
