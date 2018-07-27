/* @flow */

import invariant from 'invariant';

import type { ReduxState } from '../store';

export type Route = RouteNode;

export const DEFAULT_TAB_NAME = 'ACCOUNTS';

// -----------------------------------------------------------------------------
//
// TYPES
//
// -----------------------------------------------------------------------------

export type RouteNode = {|
  +name: string,
  +next: RouteNode | null,
  +payload?: Object,
|};

export type RootName =
  | 'MAIN'
  | 'NO_INTERNET'
  | 'AUTH'
  | 'LOADING'
  | 'PROVIDER_SEARCH'
  | 'PROVIDER_LOGIN'
  | 'RECOMMENDATION';

export type TabName = 'ACCOUNTS';

// -----------------------------------------------------------------------------
//
// CREATE THE ROUTE LINKED LIST.
//
// -----------------------------------------------------------------------------

export function createRoute(reduxState: ReduxState): Route {
  const rootName = calculateRootName(reduxState);
  switch (rootName) {
    case 'AUTH': {
      const signUpNode = reduxState.navigation.shouldShowSignUpScreen
        ? { name: 'SIGN_UP', next: null }
        : null;
      return { name: 'AUTH', next: signUpNode };
    }

    case 'MAIN': {
      return { name: 'MAIN', next: createAccounts(reduxState) };
    }

    default:
      return { name: rootName, next: null };
  }
}

function createAccounts(reduxState: ReduxState): RouteNode {
  invariant(
    reduxState.navigation.tabName === 'ACCOUNTS',
    'Expecting ACCOUNTS to be active tab: %s',
    reduxState.navigation.tabName,
  );
  const isRequestingAccountDetails =
    reduxState.navigation.accountDetailsID !== null;

  return {
    name: 'ACCOUNTS',
    next: isRequestingAccountDetails ? createAccountDetails(reduxState) : null,
  };
}

function createAccountDetails(reduxState: ReduxState): RouteNode {
  const { accountDetailsID } = reduxState.navigation;
  invariant(accountDetailsID, 'Expecting account details to be requested');
  return {
    name: 'ACCOUNT_DETAILS',
    next: null,
    payload: { accountID: accountDetailsID },
  };
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

export function stringify(route: Route): string {
  let node = route;
  let str = '';
  while (node) {
    str += `/${node.name}`;
    node = node.next;
  }
  return str;
}

export function forceGetNextNode(node: RouteNode): RouteNode {
  invariant(
    node.next,
    'Expecting route node %s to have a next node',
    node.name,
  );
  return node.next;
}

function calculateRootName(reduxState: ReduxState): RootName {
  const { actionItems, auth } = reduxState;

  switch (auth.status.type) {
    case 'LOGIN_INITIALIZE':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_INITIALIZE':
    case 'LOGOUT_FAILURE':
    case 'LOGGED_OUT':
    case 'SIGN_UP_FAILURE':
    case 'SIGN_UP_INITIALIZE': {
      // The user can only see the login page if they have internet.
      return 'AUTH';
    }

    case 'LOGGED_IN': {
      const accountVerificationPage = reduxState.accountVerification.page;
      if (!accountVerificationPage) {
        return actionItems.selectedID ? 'RECOMMENDATION' : 'MAIN';
      }
      return accountVerificationPage.type === 'SEARCH'
        ? 'PROVIDER_SEARCH'
        : 'PROVIDER_LOGIN';
    }

    case 'NOT_INITIALIZED': {
      return 'LOADING';
    }

    default:
      invariant(false, 'Unrecognized auth status: %s', auth.status.type);
  }
}
