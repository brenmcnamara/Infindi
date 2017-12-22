/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type State = {|
  +envStatus: 'ENV_LOADING' | 'ENV_READY' | 'ENV_FAILURE',
|};

const DEFAULT_STATE = {
  envStatus: 'ENV_LOADING',
  safeAreaInsets: 'LOADING',
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
