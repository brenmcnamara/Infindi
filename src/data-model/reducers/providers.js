/* @flow */

import type { ID } from 'common/types/core';
import type { ProviderContainer, ProviderFetchStatus } from '../types';
import type { PureAction } from '../../store';

export type State = {
  container: ProviderContainer,
  ordering: Array<ID>,
  status: ProviderFetchStatus,
};

const DEFAULT_STATE = {
  container: {},
  ordering: [],
  status: 'EMPTY',
};

export default function providers(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'FETCH_PROVIDERS_INITIALIZE': {
      // NOTE: Does not handle the case where we have simultaneous fetches.
      // That will probably never happen, so just assume we are only ever
      // fetching providers one at a time.
      return { ...state, status: 'LOADING' };
    }

    case 'FETCH_PROVIDERS_SUCCESS': {
      return {
        ...state,
        container: action.container,
        ordering: action.ordering,
        status: 'STEADY',
      };
    }

    case 'FETCH_PROVIDERS_FAILURE': {
      return { ...state, status: 'FAILURE' };
    }
  }
  return state;
}
