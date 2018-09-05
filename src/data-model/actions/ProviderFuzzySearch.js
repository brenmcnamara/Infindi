/* @flow */

import FindiService from '../../FindiService';
import Immutable from 'immutable';

import type FindiError from 'common/lib/FindiError';
import type Provider, {
  ProviderOrderedCollection,
} from 'common/lib/models/Provider';

export type Action =
  | Action$FetchAllProvidersFailure
  | Action$FetchAllProvidersInitialize
  | Action$FetchAllProvidersSuccess
  | Action$FetchProvidersFailure
  | Action$FetchProvidersInitialize
  | Action$FetchProvidersSuccess;

const PROVIDER_FETCH_ALL_REQUEST_ID = 'PROVIDER_FETCH_ALL';
const PROVIDER_FUZZY_SEARCH_REQUEST_ID = 'PROVIDER_FUZZY_SEARCH';

type Action$FetchAllProvidersFailure = {|
  +error: FindiError,
  +requestID: PROVIDER_FETCH_ALL_REQUEST_ID,
  +type: 'REQUEST_FAILURE',
|};

type Action$FetchAllProvidersInitialize = {|
  +genInvoke: () => Promise<ProviderOrderedCollection>,
  +requestID: PROVIDER_FETCH_ALL_REQUEST_ID,
  +type: 'REQUEST_INITIALIZE',
|};

type Action$FetchAllProvidersSuccess = {|
  +requestID: PROVIDER_FETCH_ALL_REQUEST_ID,
  +type: 'REQUEST_SUCCESS',
  +value: ProviderOrderedCollection,
|};

type Action$FetchProvidersFailure = {|
  +error: FindiError,
  +requestID: PROVIDER_FUZZY_SEARCH_REQUEST_ID,
  +type: 'REQUEST_FAILURE',
|};

type Action$FetchProvidersInitialize = {|
  +requestID: PROVIDER_FUZZY_SEARCH_REQUEST_ID,
  +type: 'REQUEST_INITIALIZE',
  +value: ProviderOrderedCollection,
|};

type Action$FetchProvidersSuccess = {|
  +requestID: PROVIDER_FUZZY_SEARCH_REQUEST_ID,
  +type: 'REQUEST_SUCCESS',
  +value: ProviderOrderedCollection,
|};

function fetchAllProviders() {
  return {
    genInvoke: genInvokeFetchAll,
    requestID: PROVIDER_FETCH_ALL_REQUEST_ID,
    type: 'REQUEST_INITIALIZE',
  };
}

function fetchProviders(searchText: string) {
  return {
    genInvoke: createGenInvokeFuzzySearch(searchText),
    requestID: PROVIDER_FUZZY_SEARCH_REQUEST_ID,
    type: 'REQUEST_INITIALIZE',
  };
}

function createGenInvokeFuzzySearch(searchText: string) {
  return async () => {
    const providers: Array<Provider> = await FindiService.genQueryProviders(
      searchText,
      100,
      0,
    );
    return Immutable.OrderedMap(providers.map(p => [p.id, p]));
  };
}

async function genInvokeFetchAll() {
  const providers: Array<Provider> = await FindiService.genQueryProviders(
    '',
    100,
    0,
  );
  return Immutable.OrderedMap(providers.map(p => [p.id, p]));
}

export default {
  fetchAllProviders,
  fetchProviders,
  PROVIDER_FETCH_ALL_REQUEST_ID,
  PROVIDER_FUZZY_SEARCH_REQUEST_ID,
};
