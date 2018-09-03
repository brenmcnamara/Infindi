/* @flow */

import FindiError from 'common/lib/FindiError';
import FindiService from '../../FindiService';
import Immutable from 'immutable';
import Provider from 'common/lib/models/Provider';
import ReduxMiddleware from '../../shared/redux/ReduxMiddleware';

import type { PureAction, ReduxState } from '../../store';

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
      case 'FETCH_PROVIDERS_INITIALIZE': {
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
      this._runSearch(searchRequest);
    }
  };

  // TODO: There is a subtle bug in this function. If multiple searches get
  // started, there is no guarantee of the order the searches will get completed
  // so an earlier search can complete after a later search, causing the results
  // of the later, more relevant search to get overridden by stale search
  // results.
  async _runSearch(searchRequest: string): Promise<void> {
    let providers: Array<Provider>;
    const { searchText } = searchRequest;
    try {
      providers = await FindiService.genQueryProviders(searchText, 100, 0);
    } catch (error) {
      this.__dispatch({
        error: FindiError.fromUnknownEntity(error),
        type: 'FETCH_PROVIDERS_FAILURE',
      });
      return;
    }

    const orderedCollection = Immutable.OrderedMap(
      providers.map(provider => [provider.id, provider]),
    );

    this.__dispatch({
      // $FlowFixMe - Immutable is being stupid.
      orderedCollection,
      type: 'FETCH_PROVIDERS_SUCCESS',
    });
  }
}
