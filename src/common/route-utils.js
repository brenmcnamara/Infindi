/* @flow */

import invariant from 'invariant';

import type { State as ReduxState } from '../reducers/root';

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
  | 'RECOMMENDATION';

export type TabName = 'ACCOUNTS';

// -----------------------------------------------------------------------------
//
// CREATE THE ROUTE LINKED LIST.
//
// -----------------------------------------------------------------------------

export function createRoute(state: ReduxState): Route {
  const rootName = calculateRootName(state);
  if (rootName !== 'MAIN') {
    return { name: rootName, next: null };
  }

  return { name: 'MAIN', next: createAccounts(state) };
}

function createAccounts(state: ReduxState): RouteNode {
  invariant(
    state.routeState.tabName === 'ACCOUNTS',
    'Expecting ACCOUNTS to be active tab: %s',
    state.routeState.tabName,
  );
  const isRequestingAccountDetails = state.routeState.accountDetailsID !== null;

  return {
    name: 'ACCOUNTS',
    next: isRequestingAccountDetails ? createAccountDetails(state) : null,
  };
}

function createAccountDetails(state: ReduxState): RouteNode {
  const { accountDetailsID } = state.routeState;
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

function calculateRootName(state: ReduxState): RootName {
  const { authStatus, configState, actionItems } = state;
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
      return 'AUTH';
    case 'LOGGED_IN':
      return actionItems.selectedID ? 'RECOMMENDATION' : 'MAIN';
    case 'NOT_INITIALIZED':
      return 'LOADING';
    default:
      invariant(false, 'Unrecognized auth status: %s', authStatus.type);
  }
}
