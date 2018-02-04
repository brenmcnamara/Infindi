/* @flow */

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';

import type { Dollars, ID } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { RootType, Route } from '../common/route-utils';
import type { State } from '../reducers/root';
import type { Toast } from '../reducers/toast';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

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
  const tab = state.routeState.requestedTab || 'ACCOUNTS';
  return { name: root, next: { name: tab, next: null } };
}

export function getNetWorth(state: State): Dollars {
  const { accounts } = state;
  switch (accounts.type) {
    case 'DOWNLOADING':
    case 'DOWNLOAD_FAILED':
    case 'EMPTY': {
      return 0;
    }

    case 'STEADY': {
      const { collection } = accounts;
      let total = 0;
      for (const id in collection) {
        if (collection.hasOwnProperty(id)) {
          total += getBalance(collection[id]);
        }
      }
      return total;
    }

    default:
      return invariant(false, 'Unrecognized account type %s', accounts.type);
  }
}

export function getToast(state: State, toastID: ID): Toast | null {
  return state.toast.bannerQueue.find(banner => banner.id === toastID) || null;
}

export function getYodleeRefreshInfoCollection(
  state: State,
): ModelCollection<'YodleeRefreshInfo', YodleeRefreshInfo> {
  if (state.yodleeRefreshInfo.type !== 'STEADY') {
    return {};
  }

  const collection = {};

  return collection;
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
