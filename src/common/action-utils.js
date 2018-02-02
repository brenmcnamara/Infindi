/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export function didLogin(action: PureAction): bool {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGGED_IN';
}

export function willLogout(action: PureAction): bool {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGOUT_INITIALIZED';
}
