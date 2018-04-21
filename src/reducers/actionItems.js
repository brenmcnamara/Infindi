/* @flow */

import invariant from 'invariant';

import type { ID } from 'common/types/core';
import type { PureAction } from '../store';

export type State = {
  +focusedIndex: number | 'EMPTY',
  +ordering: Array<ID>,
  +selectedID: ID | null,
};

const DEFAULT_STATE = {
  focusedIndex: 0,
  ordering: ['OPEN_HSA_ACCOUNT', 'REVERT_OVERDRAFT_FEE', 'OPEN_ROTH_ACCOUNT'],
  selectedID: null,
};

export default function actionItems(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'DELETE_ACTION_ITEM': {
      const { actionItemID } = action;
      const index = state.ordering.indexOf(actionItemID);
      invariant(index >= 0, 'Cannot find action item: %s', index);
      const ordering = state.ordering.slice();
      ordering.splice(index, 1);
      const focusedIndex = ordering.length === 0 ? 'EMPTY' : state.focusedIndex;
      return { ...state, focusedIndex, ordering };
    }

    case 'FOCUSED_ACTION_ITEM_CHANGE': {
      const { actionItemID } = action;
      const focusedIndex = state.ordering.indexOf(actionItemID);
      invariant(focusedIndex >= 0, 'Cannot find action item: %s', actionItemID);
      return { ...state, focusedIndex };
    }

    case 'SELECT_ACTION_ITEM': {
      return {
        ...state,
        selectedID: action.actionItemID,
      };
    }

    case 'UNSELECT_CURRENT_ACTION_ITEM': {
      invariant(
        state.selectedID,
        'Expected there to be a selected action item',
      );
      return {
        ...state,
        selectedID: null,
      };
    }
  }
  return state;
}
