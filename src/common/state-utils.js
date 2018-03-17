/* @flow */

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { Dollars, ID } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelContainer } from '../datastore';
import type { RootName, Route } from '../common/route-utils';
import type { State } from '../reducers/root';
import type { Toast } from '../reducers/toast';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

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

export function getNetWorth(state: State): Dollars {
  const { accounts } = state;
  switch (accounts.type) {
    case 'DOWNLOADING':
    case 'DOWNLOAD_FAILED':
    case 'EMPTY': {
      return 0;
    }

    case 'STEADY': {
      const { container } = accounts;
      let total = 0;
      for (const id in container) {
        if (container.hasOwnProperty(id)) {
          total += getBalance(container[id]);
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

export function getAccountLinkContainer(state: State): AccountLinkContainer {
  return state.accountLinks.type === 'STEADY'
    ? state.accountLinks.container
    : {};
}
