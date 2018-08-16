/* @flow */

import Immutable from 'immutable';

import type { LoadState } from '../types';
import type { ProviderOrderedCollection } from 'common/lib/models/Provider';
import type { PureAction } from '../../store';

export type State = {
  loadState: LoadState,
  orderedCollection: ProviderOrderedCollection,
};

const DEFAULT_STATE = {
  loadState: { type: 'EMPTY' },
  // $FlowFixMe - Immutable is being stupid.
  orderedCollection: Immutable.OrderedMap(),
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
      return { ...state, loadState: { type: 'LOADING' } };
    }

    case 'FETCH_PROVIDERS_SUCCESS': {
      return {
        ...state,
        loadState: { type: 'STEADY' },
        orderedCollection: action.orderedCollection,
      };
    }

    case 'FETCH_PROVIDERS_FAILURE': {
      return {
        ...state,
        loadState: { error: action.error, type: 'FAILURE' },
      };
    }
  }
  return state;
}
