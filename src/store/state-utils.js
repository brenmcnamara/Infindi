/* @flow */

import invariant from 'invariant';

import type { LoginPayload } from 'common/src/types/db';
import type { RootType, Route } from '../common/route-utils';
import type { State } from '../reducers/root';

// -----------------------------------------------------------------------------
//
// QUERY REDUX STATE
//
// -----------------------------------------------------------------------------

export function isAuthenticated(state: State): bool {
  return state.authStatus.type === 'LOGGED_IN';
}

export function getLoginPayload(state: State): ?LoginPayload {
  if (state.authStatus.type === 'LOGGED_IN') {
    return state.authStatus.loginPayload;
  }
  return null;
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

export function hasNetworkConnection(state: State): bool {
  const { networkStatus } = state.network;
  return networkStatus !== 'none';
}

export function getRoute(state: State): Route {
  const root = calculateRoot(state);
  if (root !== 'MAIN') {
    return { name: root, next: null };
  }
  // Need to calculate the tab that is showing.
  const tab = state.routeState.requestedTab || 'HOME';
  return { name: root, next: { name: tab, next: null } };
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function calculateRoot(state: State): RootType {
  const { authStatus, configState, network, actionItems } = state;
  if (configState.envStatus === 'ENV_LOADING') {
    return 'LOADING';
  }

  switch (authStatus.type) {
    case 'LOGIN_INITIALIZE':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_INITIALIZE':
    case 'LOGOUT_FAILURE':
    case 'LOGGED_OUT':
      // The user can only see the login page if they have internet.
      return network.networkStatus === 'none' ? 'NO_INTERNET' : 'AUTH';
    case 'LOGGED_IN':
      return actionItems.selectedID ? 'RECOMMENDATION' : 'MAIN';
    case 'NOT_INITIALIZED':
      return 'LOADING';
    default:
      invariant(false, 'Unrecognized auth status: %s', authStatus.type);
  }
}
