/* @flow */

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';
import { getContainer } from '../datastore';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { Dollars, ID } from 'common/types/core';
import type { ModelContainer } from '../datastore';
import type { State } from '../reducers/root';
import type { Toast } from '../reducers/toast';
import type { Transaction } from 'common/lib/models/Transaction';
import type { TransactionLoadingStatus } from '../reducers/transactionLoading';

type AccountLinkContainer = ModelContainer<'AccountLink', AccountLink>;

// -----------------------------------------------------------------------------
//
// QUERY REDUX STATE
//
// -----------------------------------------------------------------------------

export function getNetWorth(state: State): Dollars {
  const { accounts } = state;
  switch (accounts.type) {
    case 'DOWNLOADING':
    case 'DOWNLOAD_FAILED':
    case 'EMPTY': {
      return 0;
    }

    case 'STEADY': {
      const { container } = accounts;
      let total = 0;
      for (const id in container) {
        if (container.hasOwnProperty(id)) {
          total += getBalance(container[id]);
        }
      }
      return total;
    }

    default:
      return invariant(false, 'Unrecognized account type %s', accounts.type);
  }
}

export function getToast(state: State, toastID: ID): Toast | null {
  return state.toast.bannerQueue.find(banner => banner.id === toastID) || null;
}

export function getAccountLinkContainer(state: State): AccountLinkContainer {
  return state.accountLinks.type === 'STEADY'
    ? state.accountLinks.container
    : {};
}

// NOTE: The order the transaction firebase query returns transactions must be
// in sync with the ordering returned from the method getTransactionsForAccount,
// or there will be paging issues.
export function getTransactionsForAccount(
  state: State,
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

export function getTransactionLoadingStatus(
  state: State,
  accountID: ID,
): TransactionLoadingStatus {
  return state.transactionLoading.accountToLoadingStatus[accountID] || 'EMPTY';
}
