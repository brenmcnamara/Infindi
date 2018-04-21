/* @flow */

import type { PureAction } from '../store';

export function didLogin(action: PureAction): boolean {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGGED_IN';
}

export function willLogout(action: PureAction): boolean {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGOUT_INITIALIZED';
}
