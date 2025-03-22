// selectors/authSelectors.js
export const selectUser = (state) => state.auth.login?.currentUser;
export const selectIsLoggedIn = (state) => !!state.auth.login?.currentUser;
