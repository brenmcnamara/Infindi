/* @flow */

import { type State } from '../reducers/root';

export function isAuthenticated(state: State): bool {
  return state.authStatus.type === 'LOGGED_IN';
}

export function getUserFirstName(state: State): ?string {
  if (state.authStatus.type !== 'LOGGED_IN') {
    return null;
  }
  const { loginPayload } = state.authStatus;
  return loginPayload.userInfo.firstName;
}
