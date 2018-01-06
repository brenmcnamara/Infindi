/* @flow */

import invariant from 'invariant';

import type { ID } from 'common/src/types/core';
import type { PureAction } from '../typesDEPRECATED/redux';

export type State = {
  +focusedIndex: number | 'EMPTY',
  +ordering: Array<ID>,
  +selectedID: ID | null,
};

const DEFAULT_STATE = {
  focusedIndex: 0,
  ordering: ['OPEN_HSA_ACCOUNT' /*, 'OPEN_ROTH_ACCOUNT'*/],
  selectedID: null,
};

export default function recommendations(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'DELETE_RECOMMENDATION': {
      const { recommendationID } = action;
      const index = state.ordering.indexOf(recommendationID);
      invariant(index >= 0, 'Cannot find recommendation: %s', index);
      const ordering = state.ordering.slice();
      ordering.splice(index, 1);
      const focusedIndex = ordering.length === 0 ? 'EMPTY' : state.focusedIndex;
      return { ...state, focusedIndex, ordering };
    }

    case 'FOCUSED_RECOMMENDATION_CHANGE': {
      const { recommendationID } = action;
      const focusedIndex = state.ordering.indexOf(recommendationID);
      invariant(
        focusedIndex >= 0,
        'Cannot find recommendation: %s',
        recommendationID,
      );
      return { ...state, focusedIndex };
    }

    case 'SELECT_RECOMMENDATION': {
      return {
        ...state,
        selectedID: action.recommendationID,
      };
    }

    case 'UNSELECT_CURRENT_RECOMMENDATION': {
      invariant(
        state.selectedID,
        'Expected there to be a selected recommendation',
      );
      return {
        ...state,
        selectedID: null,
      };
    }
  }
  return state;
}
