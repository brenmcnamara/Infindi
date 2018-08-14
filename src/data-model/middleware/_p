/* @flow */

import FindiError from 'common/lib/FindiError';
import FindiService from '../../FindiService';
import Immutable from 'immutable';
import Provider from 'common/lib/models/Provider';
import ReduxMiddleware from '../../shared/redux/ReduxMiddleware';

import type { Next, PureAction, ReduxState } from '../../store';

type SearchRequest = {| +searchText: string |} | null;

type State = {
  +searchRequest: SearchRequest,
};

export default class ProviderFuzzySearch extends ReduxMiddleware<State> {
  static __calculateInitialState = (reduxState: ReduxState): State => {
    return { searchRequest: null };
  };

  static __calculateStatePostAction = (
    reduxState: ReduxState,
    prevState: State,
    action: PureAction,
  ): State => {
    switch (action.type) {
      case 'REQUEST_PROVIDER_SEARCH':
      case 'REQUEST_PROVIDER_LOGIN': {
        if (reduxState.providerFuzzySearch.loadState.type === 'EMPTY') {
          const searchText = reduxState.accountVerification.providerSearchText;
          return { ...prevState, searchRequest: { searchText } };
        }
        return prevState;
      }

      case 'UPDATE_PROVIDER_SEARCH_TEXT': {
        const { searchText } = action;
        return { ...prevState, searchRequest: { searchText } };
      }

      default: {
        return prevState;
      }
    }
  };

  __didUpdateState = (currentState: State, prevState: State): void => {
    const { searchRequest } = currentState;
    if (searchRequest && searchRequest !== prevState.searchRequest) {
      const { searchText } = searchRequest;
      runSearch(searchText, this.__dispatch);
    }
  };
}

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
