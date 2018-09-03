/* @flow */

import AccountStateUtils from '../data-model/state-utils/Account';
import AuthStateUtils from '../auth/StateUtils';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { ID } from 'common/types/core';
import type { LoadState, ModelCursorState } from '../data-model/types';
import type { ReduxState } from '../store';

function didLoadAccounts(reduxState: ReduxState): boolean {
  const { account } = reduxState;
  invariant(
    account.listenerStateMap.size <= 1,
    'Expecting at most 1 listener for accounts',
  );
  if (account.listenerStateMap.size === 0) {
    return false;
  }
  const listenerState = nullthrows(account.listenerStateMap.first());
  return listenerState.loadState.type === 'STEADY';
}

function didLoadAccountLinks(reduxState: ReduxState): boolean {
  const { accountLink } = reduxState;
  invariant(
    accountLink.listenerStateMap.size <= 1,
    'Expecting at most 1 listener for account links',
  );
  if (accountLink.listenerStateMap.size === 0) {
    return false;
  }
  const listenerState = nullthrows(accountLink.listenerStateMap.first());
  return listenerState.loadState.type === 'STEADY';
}

function didLoadProviders(reduxState: ReduxState): boolean {
  // Assuming that there is at least 1 provider (very safe assumption).
  return reduxState.providerFuzzySearch.fullCollection.size > 0;
}

function didCreateTransactionCursors(reduxState: ReduxState): boolean {
  const { lifeCycle, transaction } = reduxState;
  const { accountToTransactionCursor } = lifeCycle;

  if (
    accountToTransactionCursor.size <= 0 ||
    accountToTransactionCursor.size !==
      AccountStateUtils.getCollection(reduxState).size
  ) {
    return false;
  }
  return accountToTransactionCursor.every(
    cursorID =>
      transaction.cursorMap.get(cursorID) &&
      transaction.cursorStateMap.get(cursorID),
  );
}

function getActiveUserID(reduxState: ReduxState): ID | null {
  const loginPayload = AuthStateUtils.getLoginPayload(reduxState);
  if (!loginPayload) {
    return null;
  }
  return (
    reduxState.lifeCycle.watchSessionActiveUserID ||
    loginPayload.firebaseUser.uid
  );
}

function getIsInWatchSession(reduxState: ReduxState): boolean {
  return reduxState.lifeCycle.watchSessionActiveUserID !== null;
}

function getTransactionCursorState(
  reduxState: ReduxState,
  accountID: ID,
): ModelCursorState<'Transaction'> | null {
  const { lifeCycle, transaction } = reduxState;
  const { accountToTransactionCursor } = lifeCycle;

  const cursorID = accountToTransactionCursor.get(accountID);
  if (!cursorID) {
    return null;
  }
  return transaction.cursorStateMap.get(cursorID) || null;
}

function getUserFetchLoadState(reduxState: ReduxState): LoadState {
  const { userInfo } = reduxState;
  const operationState = userInfo.operationStateMap.first();
  return operationState ? operationState.loadState : { type: 'UNINITIALIZED' };
}

export default {
  didCreateTransactionCursors,
  didLoadAccountLinks,
  didLoadAccounts,
  didLoadProviders,
  getActiveUserID,
  getIsInWatchSession,
  getTransactionCursorState,
  getUserFetchLoadState,
};
