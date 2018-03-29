/* @flow */

import type { AuthStatus } from './types';
import type { PureAction } from '../typesDEPRECATED/redux';

export type State = AuthStatus;

const DEFAULT_STATE = { type: 'NOT_INITIALIZED' };

export default function authStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
) {
  if (action.type === 'AUTH_STATUS_CHANGE') {
    return action.status;
  }
  return state;
}
