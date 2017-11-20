/* @flow */

import { type Action } from '../types/redux';
import { type Firebase$User } from '../types/firebase';
import { type UserInfo } from '../types/db';

export type LoginErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

export type LoginPayload = {|
  +firebaseUser: Firebase$User,
  +userInfo: UserInfo,
|};

export type LoginStatus =
  | { type: 'LOGOUT_INITIALIZE' }
  | { type: 'LOGGED_OUT' }
  | { type: 'LOGOUT_FAILURE' }
  | { type: 'NOT_INITIALIZED' }
  | { type: 'LOGIN_INITIALIZE' }
  | { type: 'LOGGED_IN', payload: LoginPayload }
  | { type: 'LOGIN_FAILURE' };

export type State = LoginStatus;

const DEFAULT_STATE = { type: 'NOT_INITIALIZED' };

export default function loginStatus(
  state: State = DEFAULT_STATE,
  action: Action,
) {
  return state;
}
