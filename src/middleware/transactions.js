/* @flow */

import DataModelStateUtils from '../data-model/state-utils';
import Transaction from 'common/lib/models/Transaction';

import uuid from 'uuid/v4';

import type { ID } from 'common/types/core';
import type { PureAction, Next, StoreType } from '../store';
import type { TransactionContainer } from '../data-model/types';

const TRANSACTIONS_PER_PAGE = 20;

export default (store: StoreType) => (next: Next) => {
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

    let query = Transaction.FirebaseCollectionUNSAFE.where(
      'accountRef.refID',
      '==',
      accountID,
    )
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
      const transaction: Transaction = Transaction.fromRaw(doc.data());
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
        const transactions = DataModelStateUtils.getTransactionsForAccount(
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
