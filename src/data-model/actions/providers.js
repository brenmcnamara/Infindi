/* @flow */

import uuid from 'uuid/v4';

import type { ID } from 'common/types/core';
import type { ProviderContainer } from '../types';

export type Action =
  | Action$FetchProvidersFailure
  | Action$FetchProvidersInitialize
  | Action$FetchProvidersSuccess;

type Action$FetchProvidersInitialize = {|
  +operationID: ID,
  +searchText: string,
  +type: 'FETCH_PROVIDERS_INITIALIZE',
|};

type Action$FetchProvidersSuccess = {|
  +container: ProviderContainer,
  +operationID: ID,
  +ordering: Array<ID>,
  +type: 'FETCH_PROVIDERS_SUCCESS',
|};

type Action$FetchProvidersFailure = {|
  +operationID: ID,
  +type: 'FETCH_PROVIDERS_FAILURE',
|};

export function fetchProviders(searchText: string) {
  return {
    operationID: uuid(),
    searchText,
    type: 'FETCH_PROVIDERS_INITIALIZE',
  };
}
