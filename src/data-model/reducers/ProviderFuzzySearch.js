/* @flow */

import Immutable from 'immutable';
import ProviderFuzzySearchActions from '../actions/ProviderFuzzySearch';

import type { LoadState } from '../types';
import type {
  ProviderCollection,
  ProviderOrderedCollection,
} from 'common/lib/models/Provider';
import type { PureAction } from '../../store';

export type State = {
  filteredCollection: ProviderOrderedCollection,
  fullCollection: ProviderCollection,
  initialLoadState: LoadState,
  searchLoadState: LoadState,
};

const DEFAULT_STATE = {
  // $FlowFixMe - Immutable is being stupid.
  filteredCollection: Immutable.OrderedMap(),
  // $FlowFixMe - Immutable is being stupid.
  fullCollection: Immutable.Map(),
  // Load state for initially fetching the providers.
  initialLoadState: { type: 'UNINITIALIZED' },
  // Load state for subsequent searches of the providers.
  searchLoadState: { type: 'UNINITIALIZED' },
};

export default function providers(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'REQUEST_FAILURE': {
      if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FETCH_ALL_REQUEST_ID
      ) {
        return {
          ...state,
          initialLoadState: { error: action.error, type: 'FAILURE' },
          searchLoadState: { error: action.error, type: 'FAILURE' },
        };
      } else if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FUZZY_SEARCH_REQUEST_ID
      ) {
        return {
          ...state,
          searchLoadState: { error: action.error, type: 'FAILURE' },
        };
      }
      return state;
    }

    case 'REQUEST_INITIALIZE': {
      if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FETCH_ALL_REQUEST_ID
      ) {
        return {
          ...state,
          initialLoadState: { type: 'LOADING' },
          searchLoadState: { type: 'LOADING' },
        };
      } else if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FUZZY_SEARCH_REQUEST_ID
      ) {
        return { ...state, searchLoadState: { type: 'LOADING' } };
      }
      return state;
    }

    case 'REQUEST_SUCCESS': {
      if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FETCH_ALL_REQUEST_ID
      ) {
        return {
          ...state,
          filteredCollection: action.value,
          fullCollection: Immutable.Map(action.value),
          initialLoadState: { type: 'STEADY' },
          searchLoadState: { type: 'STEADY' },
        };
      } else if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FUZZY_SEARCH_REQUEST_ID
      ) {
        return {
          ...state,
          filteredCollection: action.value,
          searchLoadState: { type: 'STEADY' },
        };
      }
      return state;
    }
  }
  return state;
}
