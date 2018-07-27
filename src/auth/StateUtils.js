/* @flow */

import type UserInfo from 'common/lib/models/UserInfo';

import type { ID } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ReduxState } from '../store';

function getIsAdmin(reduxState: ReduxState): boolean {
  const loginPayload = getLoginPayload(reduxState);
  return Boolean(loginPayload && loginPayload.userInfo.isAdmin);
}

function getIsAuthenticated(reduxState: ReduxState): boolean {
  return reduxState.auth.status.type === 'LOGGED_IN';
}

function getLoginPayload(reduxState: ReduxState): ?LoginPayload {
  if (reduxState.auth.status.type === 'LOGGED_IN') {
    return reduxState.auth.status.loginPayload;
  }
  return null;
}

function getUserInfo(reduxState: ReduxState): UserInfo | null {
  const loginPayload = getLoginPayload(reduxState);
  if (!loginPayload) {
    return null;
  }
  return loginPayload.userInfo;
}

function getUserID(reduxState: ReduxState): ID | null {
  const userInfo = getUserInfo(reduxState);
  return userInfo ? userInfo.id : null;
}

function getUserFirstName(reduxState: ReduxState): string | null {
  const userInfo = getUserInfo(reduxState);
  return userInfo ? userInfo.firstName : null;
}

function getUserFullName(reduxState: ReduxState): string | null {
  const userInfo = getUserInfo(reduxState);
  return userInfo ? `${userInfo.firstName} ${userInfo.lastName}` : null;
}

export default {
  getIsAdmin,
  getIsAuthenticated,
  getLoginPayload,
  getUserFirstName,
  getUserFullName,
  getUserID,
  getUserInfo,
};