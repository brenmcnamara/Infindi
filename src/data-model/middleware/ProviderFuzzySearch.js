/* @flow */

import FindiError from 'common/lib/FindiError';
import FindiService from '../../FindiService';
import Immutable from 'immutable';
import Provider from 'common/lib/models/Provider';
import ReduxDiffMiddleware from '../../shared/redux/ReduxDiffMiddleware';

import type { PureAction, ReduxState } from '../../store';

type FetchAllRequest = {| +type: 'FETCH_ALL' |};

type TextSearchRequest = {| +searchText: string, +type: 'TEXT_SEARCH' |};

type State = {
  +fetchAllRequest: FetchAllRequest | null,
  +textSearchRequest: TextSearchRequest | null,
};

// TODO: ReduxMiddleware base class is a bit awkward for this use case.
// Want to invoke a method when a particular action is seen, but because we
// are forced to be declarative, we need to write to some state a request,
// which then gets checked later and compared to a previous request to detemine
// if we actually are invoking something new. Another approach that may be
// helpful would be to develop a network call middleware that automatically
// handles the semantics of initialization, success, failure triples of actions.
// We can also encode strategies for what to do when we get a new request
// that may complete with a previously sent action.
export default class ProviderFuzzySearch extends ReduxDiffMiddleware<State> {
  static __calculateInitialState = (reduxState: ReduxState): State => {
    return { searchRequest: null };
  };

  static __calculateStatePostAction = (
    reduxState: ReduxState,
    prevState: State,
    action: PureAction,
  ): State => {
    switch (action.type) {
      case 'FETCH_ALL_PROVIDERS_INITIALIZE': {
        return { ...prevState, fetchAllRequest: { type: 'FETCH_ALL' } };
      }

      case 'FETCH_PROVIDERS_INITIALIZE': {
        const { searchText } = action;
        return {
          ...prevState,
          textSearchRequest: { searchText, type: 'TEXT_SEARCH' },
        };
      }

      default: {
        return prevState;
      }
    }
  };

  __didUpdateState = (currentState: State, prevState: State): void => {
    const { fetchAllRequest, textSearchRequest } = currentState;

    if (fetchAllRequest && fetchAllRequest !== prevState.fetchAllRequest) {
      this._runFetchAll();
    }

    if (
      textSearchRequest &&
      textSearchRequest !== prevState.textSearchRequest
    ) {
      this._runTextSearch(textSearchRequest.searchText);
    }
  };

  // TODO: There is a subtle bug in this function. If multiple searches get
  // started, there is no guarantee of the order the searches will get completed
  // so an earlier search can complete after a later search, causing the results
  // of the later, more relevant search to get overridden by stale search
  // results.
  async _runTextSearch(searchText: string): Promise<void> {
    let providers: Array<Provider>;
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

  async _runFetchAll(): Promise<void> {
    let providers: Array<Provider>;
    try {
      providers = await FindiService.genQueryProviders('', 100, 0);
    } catch (error) {
      this.__dispatch({
        error: FindiError.fromUnknownEntity(error),
        type: 'FETCH_ALL_PROVIDERS_FAILURE',
      });
    }

    const collection = Immutable.OrderedMap(
      providers.map(provider => [provider.id, provider]),
    );

    this.__dispatch({
      // $FlowFixMe - Immutable is being stupid.
      collection,
      type: 'FETCH_ALL_PROVIDERS_SUCCESS',
    });
  }
}
