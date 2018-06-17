/* @flow */

import type { ID } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { State } from '../reducers/root';

export function getIsAdmin(state: State): boolean {
  const loginPayload = getLoginPayload(state);
  return Boolean(loginPayload && loginPayload.userInfo.isAdmin);
}

export function getIsAuthenticated(state: State): boolean {
  return state.auth.status.type === 'LOGGED_IN';
}

export function getLoginPayload(state: State): ?LoginPayload {
  if (state.auth.status.type === 'LOGGED_IN') {
    return state.auth.status.loginPayload;
  }
  return null;
}

export function getUserID(state: State): ID | null {
  const loginPayload = getLoginPayload(state);
  if (!loginPayload) {
    return null;
  }
  return loginPayload.userInfo.id;
}

export function getUserFirstName(state: State): ?string {
  const loginPayload = getLoginPayload(state);
  if (!loginPayload) {
    return null;
  }
  return loginPayload.userInfo.firstName;
}

export function getUserFullName(state: State): ?string {
  const loginPayload = getLoginPayload(state);
  if (!loginPayload) {
    return null;
  }
  const { userInfo } = loginPayload;
  return `${userInfo.firstName} ${userInfo.lastName}`;
}
