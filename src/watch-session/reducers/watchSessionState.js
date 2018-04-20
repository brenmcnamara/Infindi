/* @flow */

import type { ID } from 'common/types/core';
import type { PureAction } from '../../typesDEPRECATED/redux';

export type State = {
  +watchUserID: ID | null,
};

const DEFAULT_STATE: State = {
  watchUserID: null,
};

export default function eagleViewState(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'ENTER_WATCH_SESSION': {
      return { ...state, watchUserID: action.userID };
    }

    case 'EXIT_WATCH_SESSION': {
      return { ...state, watchUserID: null };
    }
  }

  return state;
}
