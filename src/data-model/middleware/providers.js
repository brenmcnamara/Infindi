/* @flow */

import { genQueryProviders } from '../../backend';

import type { ID } from 'common/types/core';
import type { Provider } from 'common/lib/models/Provider';
import type { PureAction, Next, Store } from '../../typesDEPRECATED/redux';

export default (store: Store) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'FETCH_PROVIDERS_INITIALIZE': {
        runSearch(action.searchText, action.operationID, next);
        break;
      }
    }
  };
};

async function runSearch(
  searchText: string,
  operationID: ID,
  next: Next,
): Promise<void> {
  let providers: Array<Provider>;
  try {
    const response = await genQueryProviders(searchText, 100, 0);
    providers = response.data;
  } catch (error) {
    next({
      operationID,
      type: 'FETCH_PROVIDERS_FAILURE',
    });
    return;
  }
  const container = {};
  for (const provider of providers) {
    container[provider.id] = provider;
  }
  next({
    container,
    operationID,
    ordering: providers.map(p => p.id),
    type: 'FETCH_PROVIDERS_SUCCESS',
  });
}
