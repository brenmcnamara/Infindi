/* @flow */

import AccountStateUtils from '../data-model/_state-utils/Account';

import invariant from 'invariant';
import nullthrows from 'nullthrows';

import type { ID } from 'common/types/core';
import type { LoadState, ModelCursorState } from '../data-model/_types';
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

function didCreateTransactionCursors(reduxState: ReduxState): boolean {
  const { accountToTransactionCursor, transaction } = reduxState;
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

function isActiveUserInitialized(reduxState: ReduxState): boolean {
  return (
    didLoadAccounts(reduxState) &&
    didLoadAccountLinks(reduxState) &&
    didCreateTransactionCursors(reduxState)
  );
}

function getTransactionCursorState(
  reduxState: ReduxState,
  accountID: ID,
): ModelCursorState<'Transaction'> | null {
  const { accountToTransactionCursor, transaction } = reduxState;
  const cursorID = accountToTransactionCursor.get(accountID);
  if (!cursorID) {
    return null;
  }
  return transaction.cursorStateMap.get(cursorID) || null;
}

function getUserFetchLoadState(reduxState: ReduxState): LoadState {
  const { userInfo } = reduxState;
  const operationState = userInfo.operationStateMap.first();
  return operationState ? operationState.loadState : { type: 'EMPTY' };
}

export default {
  didCreateTransactionCursors,
  didLoadAccountLinks,
  didLoadAccounts,
  getTransactionCursorState,
  getUserFetchLoadState,
  isActiveUserInitialized,
};
