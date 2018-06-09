/* @flow */

import type { PureAction } from '../../store';
import type { UserInfoContainer } from '../types';

export type State = {
  container: UserInfoContainer,
  loadStatus: 'STEADY' | 'FAILURE' | 'EMPTY' | 'LOADING',
};

const DEFAULT_STATE: State = {
  container: {},
  loadStatus: 'EMPTY',
};

export default function userInfo(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'CLEAR_ALL_USERS': {
      return { ...state, container: {}, loadStatus: 'EMPTY' };
    }

    case 'FETCH_ALL_USERS_INITIALIZE': {
      return { ...state, loadStatus: 'LOADING' };
    }

    case 'FETCH_ALL_USERS_SUCCESS': {
      return { ...state, container: action.container, loadStatus: 'STEADY' };
    }

    case 'FETCH_ALL_USERS_FAILURE': {
      return { ...state, loadStatus: 'FAILURE' };
    }
  }
  return state;
}
