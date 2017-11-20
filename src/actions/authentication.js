/* @flow */

export type Action = Action$LoginInitialize | Action$LogoutInitialize;

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
