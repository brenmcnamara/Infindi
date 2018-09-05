/* @flow */

import type FindiError from 'common/lib/FindiError';

import type { ProviderOrderedCollection } from 'common/lib/models/Provider';

export type Action =
  | Action$FetchAllProvidersFailure
  | Action$FetchAllProvidersInitialize
  | Action$FetchAllProvidersSuccess
  | Action$FetchProvidersFailure
  | Action$FetchProvidersInitialize
  | Action$FetchProvidersSuccess;

type Action$FetchProvidersInitialize = {|
  +searchText: string,
  +type: 'FETCH_PROVIDERS_INITIALIZE',
|};

type Action$FetchProvidersSuccess = {|
  +orderedCollection: ProviderOrderedCollection,
  +type: 'FETCH_PROVIDERS_SUCCESS',
|};

type Action$FetchProvidersFailure = {|
  +error: FindiError,
  +type: 'FETCH_PROVIDERS_FAILURE',
|};

type Action$FetchAllProvidersInitialize = {|
  +type: 'FETCH_ALL_PROVIDERS_INITIALIZE',
|};

type Action$FetchAllProvidersSuccess = {|
  +collection: ProviderOrderedCollection,
  +type: 'FETCH_ALL_PROVIDERS_SUCCESS',
|};

type Action$FetchAllProvidersFailure = {|
  +error: FindiError,
  +type: 'FETCH_ALL_PROVIDERS_FAILURE',
|};

function fetchAllProviders() {
  return { type: 'FETCH_ALL_PROVIDERS_INITIALIZE' };
}

function fetchProviders(searchText: string) {
  return { searchText, type: 'FETCH_PROVIDERS_INITIALIZE' };
}

export default {
  fetchAllProviders,
  fetchProviders,
};
