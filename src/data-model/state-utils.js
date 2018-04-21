/* @flow */

import type { ID } from 'common/types/core';
import type { Provider } from 'common/lib/models/Provider';
import type { ReduxState } from '../store';

function getProviders(state: ReduxState): Array<Provider> {
  return state.providers.ordering.map(id => state.providers.container[id]);
}

function getCursorForAccount(state: ReduxState, accountID: ID): Object | null {
  return state.transactionLoading.accountToCursor[accountID] || null;
}

export default {
  getCursorForAccount,
  getProviders,
};
