/* @flow */

import FindiService from '../../FindiService';
import Provider from 'common/lib/models/Provider';

import uuid from 'uuid/v4';

import type { PureAction, Next, StoreType } from '../../store';

export default (store: StoreType) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'REQUEST_PROVIDER_SEARCH':
      case 'REQUEST_PROVIDER_LOGIN': {
        const state = store.getState();
        if (state.providers.status === 'EMPTY') {
          runSearch(state.accountVerification.providerSearchText, next);
        }
        break;
      }

      case 'UPDATE_PROVIDER_SEARCH_TEXT': {
        runSearch(action.searchText, next);
        break;
      }
    }
  };
};

async function runSearch(searchText: string, next: Next): Promise<void> {
  const operationID = uuid();
  next({
    operationID,
    searchText,
    type: 'FETCH_PROVIDERS_INITIALIZE',
  });
  let providers: Array<Provider>;
  try {
    providers = await FindiService.genQueryProviders(searchText, 100, 0);
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
