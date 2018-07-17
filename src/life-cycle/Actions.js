/* @flow */

import type { ID } from 'common/types/core';

export type Action =
  | Action$AddAccountToTransactionCursorPair
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

export default {
  addAccountToTransactionCursorPair,
  removeAccountToTransactionCursorPair,
};
