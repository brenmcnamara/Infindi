/* @flow */

import invariant from 'invariant';
import uuid from 'uuid/v4';

import { getTransactionCollection } from 'common/lib/models/Transaction';
import { getTransactionsForAccount } from '../common/state-utils';
import { getUserID } from '../auth/state-utils';

import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../store';
import type { Transaction } from 'common/lib/models/Transaction';

type TransactionContainer = ModelContainer<'Transaction', Transaction>;

const TRANSACTIONS_PER_PAGE = 20;

export default (store: Store) => (next: Next) => {
  async function genFetchTransactions(
    accountID: ID,
    cursor: Object | null,
  ): Promise<void> {
    const operationID = uuid();
    next({
      downloadInfo: { accountID },
      modelName: 'Transaction',
      operationID,
      type: 'CONTAINER_DOWNLOAD_START',
    });

    const userID = getUserID(store.getState());
    invariant(userID, 'Trying to fetch transactions when no user is logged in');

    let query = getTransactionCollection()
      .where('userRef.refID', '==', userID)
      .where('accountRef.refID', '==', accountID)
      .orderBy('transactionDate', 'desc')
      // NOTE: Sorting by id so that all results have a deterministic order.
      // Because transaction dates are rounded to the nearest day, there are
      // often ties when sorting by transaction date, which messes with paging.
      .orderBy('id');

    if (cursor) {
      query = query.startAfter(cursor);
    }

    let snapshot;
    try {
      // NOTE: The order the transaction firebase query returns transactions must
      // be in sync with the ordering returned from the method
      // getTransactionsForAccount, or there will be paging issues.
      snapshot = await query.limit(TRANSACTIONS_PER_PAGE).get();
    } catch (error) {
      next({
        error,
        modelName: 'Transaction',
        operationID,
        type: 'CONTAINER_DOWNLOAD_FAILURE',
      });
      return;
    }

    const container: TransactionContainer = {};
    const { docs } = snapshot;
    docs.forEach(doc => {
      if (!doc.exists) {
        return;
      }
      const transaction = doc.data();
      container[transaction.id] = transaction;
    });

    const downloadInfo = {
      cursor:
        docs.length < TRANSACTIONS_PER_PAGE ? null : docs[docs.length - 1],
    };

    next({
      container,
      downloadInfo,
      modelName: 'Transaction',
      operationID,
      type: 'CONTAINER_DOWNLOAD_FINISHED',
      updateStrategy: 'MERGE_WITH_CURRENT_CONTAINER',
    });
  }

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'VIEW_ACCOUNT_DETAILS': {
        const { accountID } = action;
        const transactions = getTransactionsForAccount(
          store.getState(),
          accountID,
        );
        if (transactions.length !== 0) {
          break;
        }
        genFetchTransactions(accountID, null);
        break;
      }

      case 'TRANSACTIONS_FETCH': {
        const { accountID, cursor } = action;
        genFetchTransactions(accountID, cursor);
        break;
      }
    }
  };
};
