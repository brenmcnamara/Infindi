/* @flow */

import AccountLinkStateUtils from '../data-model/_state-utils/AccountLink';

import { getContainer } from '../datastore';

import type AccountLink from 'common/lib/models/AccountLink';
import type Provider from 'common/lib/models/Provider';
import type Transaction from 'common/lib/models/Transaction';

import type { ID } from 'common/types/core';
import type { ReduxState } from '../store';
import type { TransactionLoadingStatus } from '../data-model/types';

function getProviders(state: ReduxState): Array<Provider> {
  return state.providers.ordering.map(id => state.providers.container[id]);
}

function getCursorForAccount(state: ReduxState, accountID: ID): Object | null {
  return state.transactionLoading.accountToCursor[accountID] || null;
}

function getAccountLinkForProviderID(
  reduxState: ReduxState,
  providerID: ID,
): AccountLink | null {
  return (
    AccountLinkStateUtils.getCollection(reduxState).find(
      accountLink => accountLink.providerRef.refID === providerID,
    ) || null
  );
}

// NOTE: The order the transaction firebase query returns transactions must be
// in sync with the ordering returned from the method getTransactionsForAccount,
// or there will be paging issues.
function getTransactionsForAccount(
  state: ReduxState,
  accountID: ID,
): Array<Transaction> {
  const transactionContainer = getContainer(state.transactions);
  if (!transactionContainer) {
    return [];
  }
  const transactions = [];

  for (const transactionID in transactionContainer) {
    if (
      transactionContainer.hasOwnProperty(transactionID) &&
      transactionContainer[transactionID].accountRef.refID === accountID
    ) {
      transactions.push(transactionContainer[transactionID]);
    }
  }
  transactions.sort((t1, t2) => {
    const timeDiff =
      t2.transactionDate.getTime() - t1.transactionDate.getTime();
    if (timeDiff === 0) {
      return t1.id < t2.id ? -1 : 1;
    }
    return timeDiff;
  });
  return transactions;
}

function getTransactionLoadingStatus(
  state: ReduxState,
  accountID: ID,
): TransactionLoadingStatus {
  return state.transactionLoading.accountToLoadingStatus[accountID] || 'EMPTY';
}

export default {
  getAccountLinkForProviderID,
  getCursorForAccount,
  getProviders,
  getTransactionLoadingStatus,
  getTransactionsForAccount,
};
