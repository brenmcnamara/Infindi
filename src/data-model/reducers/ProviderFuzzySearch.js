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
    case 'REQUEST_FAILURE': {
      if (
        action.requestID ===
          ProviderFuzzySearchActions.PROVIDER_FETCH_ALL_REQUEST_ID ||
        action.requestID ===
          ProviderFuzzySearchActions.PROVIDER_FUZZY_SEARCH_REQUEST_ID
      ) {
        return {
          ...state,
          loadState: { error: action.error, type: 'FAILURE' },
        };
      }
      return state;
    }

    case 'REQUEST_INITIALIZE': {
      if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FETCH_ALL_REQUEST_ID
      ) {
        return { ...state, loadState: { type: 'LOADING' } };
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
          fullCollection: Immutable.Map(action.collection),
          loadState: { type: 'STEADY' },
        };
      } else if (
        action.requestID ===
        ProviderFuzzySearchActions.PROVIDER_FUZZY_SEARCH_REQUEST_ID
      ) {
        return {
          ...state,
          filteredCollection: action.value,
          loadState: { type: 'STEADY' },
        };
      }
      return state;
    }
  }
  return state;
}
