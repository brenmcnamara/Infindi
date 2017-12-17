/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type State = {|
  +status: 'ENV_LOADING' | 'ENV_READY' | 'ENV_FAILURE',
|};

const DEFAULT_STATE = {
  status: 'ENV_LOADING',
};

export default function envStatus(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  if (action.type === 'ENV_STATUS_CHANGE') {
    return { ...state, status: action.status };
  }
  return state;
}
