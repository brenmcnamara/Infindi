/* @flow */

import type { AuthStatus } from './types';
import type { PureAction } from '../store';

export type State = {
  isShowingSignUpScreen: false,
  status: AuthStatus,
};

const DEFAULT_STATE = {
  isShowingSignUpScreen: false,
  status: { type: 'NOT_INITIALIZED' },
};

export default function authStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
) {
  switch (action.type) {
    case 'AUTH_STATUS_CHANGE': {
      return { ...state, status: action.status };
    }

    case 'SHOW_SIGN_UP_SCREEN': {
      return { ...state, isShowingSignUpScreen: action.isShowing };
    }
  }
  return state;
}
