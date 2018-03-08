/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type EnvStatus = 'ENV_LOADING' | 'ENV_READY' | 'ENV_FAILURE';

export type VerificationService = 'PLAID' | 'YODLEE';

export type Inset = {|
  +bottom: number,
  +left: number,
  +right: number,
  +top: number,
|};

// NOTE: Initial app inset is a hacky fix so that the keyboard avoiding view and
// safe area view
export type State = {
  +appInset: Inset,
  +envStatus: EnvStatus,
};

const DEFAULT_STATE: State = {
  appInset: { bottom: 0, left: 0, right: 0, top: 0 },
  didSetInitialAppInset: false,
  envStatus: 'ENV_LOADING',
  initialAppInset: { bottom: 0, left: 0, right: 0, top: 0 },
};

export default function configStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'APP_INSET_CHANGE': {
      return {
        ...state,
        appInset: action.inset,
      };
    }

    case 'ENV_STATUS_CHANGE': {
      return { ...state, envStatus: action.status };
    }
  }
  return state;
}
