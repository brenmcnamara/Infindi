/* @flow */

import type FindiError from 'common/lib/FindiError';

export type Action = Action$FatalFailure | ResolveFatalFailureAction;

export type ResolveFatalFailureAction = Action$RetryLoginInitialization;

type Action$FatalFailure = {|
  +error: FindiError,
  +retry: ResolveFatalFailureAction,
  +type: 'FATAL_FAILURE',
|};

export function fatalFailure(
  error: FindiError,
  retry: ResolveFatalFailureAction,
) {
  return { error, retry, type: 'FATAL_FAILURE' };
}

type Action$RetryLoginInitialization = {|
  +type: 'RETRY_LOGIN_INITIALIZATION',
|};

export function retryLoginInitialization() {
  return { type: 'RETRY_LOGIN_INITIALIZATION' };
}
