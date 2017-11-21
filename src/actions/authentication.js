/* @flow */

export type Action =
  | Action$LoginInitialize
  | Action$LogoutInitialize
  | Action$PasswordResetInitialize
  | Action$PasswordResetComplete;

type Action$LoginInitialize = {|
  +email: string,
  +password: string,
  +type: 'LOGIN_INITIALIZE',
|};

export function login(email: string, password: string) {
  return { type: 'LOGIN_INITIALIZE', email, password };
}

type Action$LogoutInitialize = {|
  +type: 'LOGOUT_INITIALIZE',
|};

export function logout() {
  return { type: 'LOGOUT_INITIALIZE' };
}

type Action$PasswordResetInitialize = {|
  +email: string,
  +type: 'PASSWORD_RESET_INITIALIZE',
|};

export function passwordResetInitialize(email: string) {
  return { email, type: 'PASSWORD_RESET_INITIALIZE' };
}
