/* @flow */

import type { EnvStatus } from '../reducers/configState';

export type Action = Action$EnvStatusChange;

export type Action$EnvStatusChange = {|
  +status: EnvStatus,
  +type: 'ENV_STATUS_CHANGE',
|};

export function envDoneLoading(): Action$EnvStatusChange {
  return {
    status: 'ENV_READY',
    type: 'ENV_STATUS_CHANGE',
  };
}

export function envFailedLoading(): Action$EnvStatusChange {
  return {
    status: 'ENV_FAILURE',
    type: 'ENV_STATUS_CHANGE',
  };
}
