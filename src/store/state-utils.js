/* @flow */

import { type State } from '../reducers/root';

export function isAuthenticated(state: State): bool {
  return state.authStatus.type === 'LOGGED_IN';
}
