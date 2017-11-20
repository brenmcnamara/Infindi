/* @flow */

import { type Action } from '../types/redux';
import { type Firebase$User } from '../types/firebase';
import { type UserInfo } from '../types/db';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#signInWithEmailAndPassword
export type LoginErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

// TODO: Could not find documentation on firebase logout error codes, should
// investigate this further.
export type LogoutErrorCode = 'auth/no-current-user' | string;

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#createUserWithEmailAndPassword
export type CreateUserErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

export type LoginPayload = {|
  +firebaseUser: Firebase$User,
  +userInfo: UserInfo,
|};

export type AuthStatus =
  | {| +type: 'LOGOUT_INITIALIZE' |}
  | {| +type: 'LOGGED_OUT' |}
  | {| +type: 'LOGOUT_FAILURE', +errorCode: LogoutErrorCode |}
  | {| +type: 'NOT_INITIALIZED' |}
  | {| +type: 'LOGIN_INITIALIZE' |}
  | {| +type: 'LOGGED_IN', payload: LoginPayload |}
  | {| +type: 'LOGIN_FAILURE', +errorCode: LoginErrorCode |};

export type State = AuthStatus;

const DEFAULT_STATE = { type: 'NOT_INITIALIZED' };

export default function authStatus(
  state: State = DEFAULT_STATE,
  action: Action,
) {
  if (action.type === 'AUTH_STATUS_CHANGE') {
    return action.status;
  }
  return state;
}
