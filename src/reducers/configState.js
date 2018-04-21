/* @flow */

import type { PureAction } from '../store';

export type EnvStatus = 'ENV_LOADING' | 'ENV_READY' | 'ENV_FAILURE';

export type VerificationService = 'PLAID' | 'YODLEE';

// NOTE: Initial app inset is a hacky fix so that the keyboard avoiding view and
// safe area view
export type State = {
  +envStatus: EnvStatus,
};

const DEFAULT_STATE: State = {
  envStatus: 'ENV_LOADING',
};

export default function configStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'ENV_STATUS_CHANGE': {
      return { ...state, envStatus: action.status };
    }
  }
  return state;
}
