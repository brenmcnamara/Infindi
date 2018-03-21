/* @flow */

import type { ID } from 'common/types/core';
import type { State as ReduxState } from '../../reducers/root';

function getCursorForAccount(state: ReduxState, accountID: ID): Object | null {
  return state.transactionLoading.accountToCursor[accountID] || null;
}

export default {
  getCursorForAccount,
};
