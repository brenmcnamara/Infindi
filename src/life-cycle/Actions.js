/* @flow */

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

export default {
  addAccountToTransactionCursorPair,
  enterWatchSession,
  exitWatchSession,
  removeAccountToTransactionCursorPair,
};
