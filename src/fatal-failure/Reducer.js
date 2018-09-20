/* @flow */

import { isActionResolvingInitializationFailure } from './_utils';

import type FindiError from 'common/lib/FindiError';

import type { Action, PureAction } from '../store';

export type State = {
  error: FindiError | null,
  retry: Action | null,
};

const DEFAULT_STATE = {
  error: null,
  retry: null,
};

export default function fatalFailure(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  if (isActionResolvingInitializationFailure(action)) {
    return { ...state, error: null, retry: null };
  }

  switch (action.type) {
    case 'FATAL_FAILURE': {
      return {
        ...state,
        error: action.error,
        retry: action.retry,
      };
    }

    default:
      return state;
  }
}
