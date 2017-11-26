/* @flow */

import invariant from 'invariant';

import { type State } from '../reducers/root';

export function isAuthenticated(state: State): bool {
  return state.authStatus.type === 'LOGGED_IN';
}

export function getUserFirstName(state: State): string {
  // TODO: Remove this temporary call here.
  if (state.authStatus.type !== 'LOGGED_IN') {
    return 'blah';
  }
  invariant(
    state.authStatus.type === 'LOGGED_IN',
    'Trying to get firstName of unauthenticated user',
  );
  const { loginPayload } = state.authStatus;
  return loginPayload.userInfo.firstName;
}
