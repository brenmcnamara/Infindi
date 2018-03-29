/* @flow */

import type { AuthStatus } from './types';
import type { LoginCredentials } from 'common/lib/models/Auth';

export type Action =
  | Action$AuthStatusChange
  | Action$LoginRequest
  | Action$LogoutRequest;

type Action$LoginRequest = {|
  +loginCredentials: LoginCredentials,
  +type: 'LOGIN_REQUEST',
|};

export function login(loginCredentials: LoginCredentials) {
  return { loginCredentials, type: 'LOGIN_REQUEST' };
}

type Action$LogoutRequest = {|
  +type: 'LOGOUT_REQUEST',
|};

export function logout() {
  return { type: 'LOGOUT_REQUEST' };
}

// NOTE: Used by middleware
type Action$AuthStatusChange = {|
  +status: AuthStatus,
  +type: 'AUTH_STATUS_CHANGE',
|};
