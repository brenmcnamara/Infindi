/* @flow */

import type { ID } from 'common/types/core';

export type Action = Action$TransactionsFetch;

type Action$TransactionsFetch = {|
  +accountID: ID,
  +cursor: Object,
  +type: 'TRANSACTIONS_FETCH',
|};

export function fetchTransactions(accountID: ID, cursor: Object) {
  return {
    accountID,
    cursor,
    type: 'TRANSACTIONS_FETCH',
  };
}
