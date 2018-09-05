/* @flow */

import Immutable from 'immutable';

import type { LoadState } from '../types';
import type {
  ProviderCollection,
  ProviderOrderedCollection,
} from 'common/lib/models/Provider';
import type { PureAction } from '../../store';

export type State = {
  filteredCollection: ProviderOrderedCollection,
  fullCollection: ProviderCollection,
  loadState: LoadState,
};

const DEFAULT_STATE = {
  // $FlowFixMe - Immutable is being stupid.
  filteredCollection: Immutable.OrderedMap(),
  // $FlowFixMe - Immutable is being stupid.
  fullCollection: Immutable.Map(),
  // TODO: It is not clear what the semantics of this are. loadState is being
  // updated sometimes on fuzzy search fetches and sometimes during the initial
  // fetch.
  loadState: { type: 'UNINITIALIZED' },
};

export default function providers(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'FETCH_ALL_PROVIDERS_FAILURE': {
      return {
        ...state,
        loadState: { error: action.error, type: 'FAILURE' },
      };
    }

    case 'FETCH_ALL_PROVIDERS_INITIALIZE': {
      return { ...state, loadState: { type: 'LOADING' } };
    }

    case 'FETCH_ALL_PROVIDERS_SUCCESS': {
      return {
        ...state,
        filteredCollection: action.collection,
        fullCollection: Immutable.Map(action.collection),
        loadState: { type: 'STEADY' },
      };
    }

    case 'FETCH_PROVIDERS_SUCCESS': {
      return {
        ...state,
        filteredCollection: action.orderedCollection,
        loadState: { type: 'STEADY' },
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
