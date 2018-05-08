/* @flow */

import type {
  LoginCredentials,
  LoginPayload,
  SignUpForm,
} from 'common/lib/models/Auth';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#signInWithEmailAndPassword
export type LoginErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

// TODO: Could not find documentation on firebase logout error codes, should
// investigate this further.
export type LogoutErrorCode = 'auth/no-current-user' | string;

export type PasswordResetInitializeErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-not-found';

// TODO: Doc link
export type PasswordResetErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/week-password';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#createUserWithEmailAndPassword
// TODO: What happens if I create a user with an existing email? What error?
export type CreateUserErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

// TODO: Doc link
export type PendingVerificationErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-found';

// https://rnfirebase.io/docs/v3.1.*/auth/reference/auth#checkActionCode
export type CheckingVerificationErrorCode =
  | 'auth/expired-action-code'
  | 'auth/invalid-action-code'
  | 'auth/user-disabled'
  | 'auth/user-not-disabled';

export type VerificationPayload = {|
  +email: string,
  +type: 'EMAIL',
|};

export type AuthStatus =
  | {|
      +type: 'LOGOUT_INITIALIZE',
    |}
  | {|
      +type: 'LOGGED_OUT',
    |}
  | {|
      +errorCode: LogoutErrorCode,
      +type: 'LOGOUT_FAILURE',
    |}
  | {|
      +type: 'NOT_INITIALIZED',
    |}
  | {|
      +loginCredentials: LoginCredentials,
      +type: 'LOGIN_INITIALIZE',
    |}
  | {|
      +loginPayload: LoginPayload,
      +type: 'LOGGED_IN',
    |}
  | {|
      +errorCode: LoginErrorCode,
      +type: 'LOGIN_FAILURE',
    |}
  | {|
      +signUpForm: SignUpForm,
      +type: 'SIGN_UP_INITIALIZE',
    |}
  | {|
      +errorMessage: string,
      +signUpForm: SignUpForm,
      +type: 'SIGN_UP_FAILURE',
    |};

export type AuthStatusType =
  | 'LOGOUT_INITIALIZE'
  | 'LOGGED_OUT'
  | 'LOGOUT_FAILURE'
  | 'NOT_INITIALIZED'
  | 'LOGIN_INITIALIZE'
  | 'LOGGED_IN'
  | 'LOGIN_FAILURE'
  | 'SIGN_UP_FAILURE'
  | 'SIGN_UP_INITIALIZE';
