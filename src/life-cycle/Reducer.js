/* @flow */

import Immutable from 'immutable';

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { PureAction } from '../store';

export type State = {
  accountToTransactionCursor: Immutable.Map<ID, ID>,
  watchSessionActiveUserID: ID | null,
};

const DEFAULT_STATE = {
  accountToTransactionCursor: Immutable.Map(),
  watchSessionActiveUserID: null,
};

export default function lifeCycle(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'ADD_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR': {
      invariant(
        !state.accountToTransactionCursor.get(action.accountID),
        'Expecting transaction cursor to not exist for account: %s',
        action.accountID,
      );
      return {
        ...state,
        accountToTransactionCursor: state.accountToTransactionCursor.set(
          action.accountID,
          action.transactionCursorID,
        ),
      };
    }

    case 'ENTER_WATCH_SESSION': {
      return {
        ...state,
        watchSessionActiveUserID: action.userID,
      };
    }

    case 'EXIT_WATCH_SESSION': {
      return {
        ...state,
        watchSessionActiveUserID: null,
      };
    }

    case 'REMOVE_ACCOUNT_TO_TRANSACTION_CURSOR_PAIR': {
      invariant(
        state.accountToTransactionCursor.get(action.accountID),
        'Expecting transaction cursor to exist for account: %s',
        action.accountID,
      );
      return {
        ...state,
        accountToTransactionCursor: state.accountToTransactionCursor.delete(
          action.accountID,
        ),
      };
    }

    default: {
      return state;
    }
  }
}
