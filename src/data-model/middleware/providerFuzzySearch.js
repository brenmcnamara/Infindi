/* @flow */

import FindiError from 'common/lib/FindiError';
import FindiService from '../../FindiService';
import Immutable from 'immutable';
import Provider from 'common/lib/models/Provider';

import type { PureAction, Next, StoreType } from '../../store';

export default (store: StoreType) => (next: Next) => {
  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'REQUEST_PROVIDER_SEARCH':
      case 'REQUEST_PROVIDER_LOGIN': {
        const reduxState = store.getState();
        if (reduxState.providerFuzzySearch.loadState.type === 'EMPTY') {
          runSearch(reduxState.accountVerification.providerSearchText, next);
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
  next({
    searchText,
    type: 'FETCH_PROVIDERS_INITIALIZE',
  });
  let providers: Array<Provider>;
  try {
    providers = await FindiService.genQueryProviders(searchText, 100, 0);
  } catch (error) {
    next({
      error: FindiError.fromUnknownEntity(error),
      type: 'FETCH_PROVIDERS_FAILURE',
    });
    return;
  }

  const orderedCollection = Immutable.OrderedMap(
    providers.map(provider => [provider.id, provider]),
  );

  next({
    // $FlowFixMe - Immutable is being stupid.
    orderedCollection,
    type: 'FETCH_PROVIDERS_SUCCESS',
  });
}
