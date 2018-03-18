/* @flow */

import invariant from 'invariant';

import { getTransactionCollection } from 'common/lib/models/Transaction';
import { getTransactionsForAccount, getUserID } from '../common/state-utils';

import type { ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';
import type { Transaction } from 'common/lib/models/Transaction';

type TransactionContainer = ModelContainer<'Transaction', Transaction>;

export default (store: Store) => (next: Next) => {
  // We will open a collection listener for each account that the user has.

  async function genFetchTransactions(accountID: ID): Promise<void> {
    next({
      downloadInfo: { accountIDs: [accountID] },
      modelName: 'Transaction',
      type: 'CONTAINER_DOWNLOAD_START',
    });

    const userID = getUserID(store.getState());
    invariant(userID, 'Trying to fetch transactions when no user is logged in');

    let snapshot;
    try {
      // NOTE: The order the transaction firebase query returns transactions must
      // be in sync with the ordering returned from the method
      // getTransactionsForAccount, or there will be paging issues.
      snapshot = await getTransactionCollection()
        .where('userRef.refID', '==', userID)
        .where('accountRef.refID', '==', accountID)
        .orderBy('transactionDate', 'desc')
        .limit(20)
        .get();
    } catch (error) {
      next({
        error,
        modelName: 'Transaction',
        type: 'CONTAINER_DOWNLOAD_FAILURE',
      });
      return;
    }

    const container: TransactionContainer = {};
    snapshot.docs.forEach(doc => {
      if (!doc.exists) {
        return;
      }
      const transaction = doc.data();
      container[transaction.id] = transaction;
    });

    next({
      container,
      modelName: 'Transaction',
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
        genFetchTransactions(accountID);
        break;
      }
    }
  };
};
