/* @flow */

import type FindiError from 'common/lib/FindiError';

import type { ProviderOrderedCollection } from 'common/lib/models/Provider';

export type Action =
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
