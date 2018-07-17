/* @flow */

import Immutable from 'immutable';

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { PureAction } from '../../store';

export type State = Immutable.Map<ID, ID>;

const DEFAULT_STATE = Immutable.Map();

export default function _accountToTransactionCursor(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'ADD_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR': {
      invariant(
        !state.get(action.accountID),
        'Expecting transaction cursor to not exist for account: %s',
        action.accountID,
      );
      return state.set(action.accountID, action.transactionCursorID);
    }

    case 'REMOVE_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR': {
      invariant(
        state.get(action.accountID),
        'Expecting transaction cursor to exist for account: %s',
        action.accountID,
      );
      return state.delete(action.accountID);
    }

    default: {
      return state;
    }
  }
}
