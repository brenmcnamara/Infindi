/* @flow */

import ProviderFuzzySearchActions from '../data-model/actions/ProviderFuzzySearch';
import ProviderFuzzySearchStateUtils from '../data-model/state-utils/ProviderFuzzySearch';

import type { Dispatch, GetState } from '../store';
import type { ID } from 'common/types/core';

export type Action =
  | Action$AddAccountToTransactionCursorPair
  | Action$EnterWatchSession
  | Action$ExitWatchSession
  | Action$RemoveAccountToTransactionCursorPair;

export type Action$AddAccountToTransactionCursorPair = {|
  +accountID: ID,
  +transactionCursorID: ID,
  +type: 'ADD_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR',
|};

function addAccountToTransactionCursorPair(
  accountID: ID,
  transactionCursorID: ID,
) {
  return {
    accountID,
    transactionCursorID,
    type: 'ADD_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR',
  };
}

export type Action$RemoveAccountToTransactionCursorPair = {|
  +accountID: ID,
  +type: 'REMOVE_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR',
|};

function removeAccountToTransactionCursorPair(accountID: ID) {
  return {
    accountID,
    type: 'REMOVE_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR',
  };
}

type Action$EnterWatchSession = {|
  +type: 'ENTER_WATCH_SESSION',
  +userID: ID,
|};

function enterWatchSession(userID: ID) {
  return {
    type: 'ENTER_WATCH_SESSION',
    userID,
  };
}

type Action$ExitWatchSession = {|
  +type: 'EXIT_WATCH_SESSION',
|};

function exitWatchSession() {
  return {
    type: 'EXIT_WATCH_SESSION',
  };
}

function retryAppInitialization() {
  // NOTE: Redoing the app initialization is tricky. If app initialization fails,
  // we assume that the firebase listeners and cursors are set correctly, because
  // they are listening to a socket for data (and because the firebase data is
  // cached and can be loaded even when offline). Need to check on a
  // case-by-case basis if any of the initilizations failed and re-run them.
  return (dispatch: Dispatch, getState: GetState) => {
    const reduxState = getState();
    const providerInitialLoadState = ProviderFuzzySearchStateUtils.getInitialLoadState(
      reduxState,
    );
    if (providerInitialLoadState.type === 'FAILURE') {
      dispatch(ProviderFuzzySearchActions.fetchAllProviders());
    }
  };
}

export default {
  addAccountToTransactionCursorPair,
  enterWatchSession,
  exitWatchSession,
  removeAccountToTransactionCursorPair,
  retryAppInitialization,
};
