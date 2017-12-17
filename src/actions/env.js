/* @flow */

export type Action = Action$EnvStatusChange;

export type Action$EnvStatusChange = {|
  +status: 'ENV_LOADING',
  +type: 'ENV_STATUS_CHANGE',
|};

export function envDoneLoading() {
  return {
    status: 'ENV_READY',
    type: 'ENV_STATUS_CHANGE',
  };
}

export function envFailedLoading() {
  return {
    status: 'ENV_FAILURE',
    type: 'ENV_STATUS_CHANGE',
  };
}
