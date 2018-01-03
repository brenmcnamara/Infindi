/* @flow */

import type { EnvStatus, Inset } from '../reducers/configState';

export type Action = Action$AppInsetChange | Action$EnvStatusChange;

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

export type Action$AppInsetChange = {|
  +inset: Inset,
  +type: 'APP_INSET_CHANGE',
|};

export function appInsetChange(inset: Inset): Action$AppInsetChange {
  return {
    inset,
    type: 'APP_INSET_CHANGE',
  };
}
