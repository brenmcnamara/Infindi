/* @flow */

import type { ModelContainer } from '../../datastore';
import type { PureAction } from '../../typesDEPRECATED/redux';
import type { UserInfo } from 'common/lib/models/UserInfo';

export type State = {
  container: ModelContainer<'UserInfo', UserInfo>,
  loadStatus: 'STEADY' | 'FAILURE' | 'ERROR' | 'EMPTY' | 'LOADING',
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
