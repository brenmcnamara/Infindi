/* @flow */

import FindiService from '../../FindiService';

import invariant from 'invariant';

import type Provider from 'common/lib/models/Provider';

export type ResultCallback = () => any;
export type Subscription = () => void;

export type ProvidersPayload =
  | { type: 'SUCCESS', providers: Array<Provider> }
  | { type: 'FAILURE' };

const LIMIT = 20;

export default class ProviderSearchManager {
  _callback: ResultCallback | null = null;
  _currentSearch: string | null = null;
  _didFailLastRun: boolean = false;
  _lastSuccessfulSearch: string | null = null;
  _nextPage: number = 0;
  _providersByPage: Array<Array<Provider>> = [];
  _runningSearch: string | null = null;

  clearSearch(): void {
    this._currentSearch = null;
    this._didFailLastRun = false;
    this._lastSuccessfulSearch = null;
    this._nextPage = 0;
    this._providersByPage = [];
    this._runningSearch = null;
    this._callback && this._callback();
  }

  updateSearch(search: string): void {
    if (search === this._currentSearch) {
      return;
    }
    this._nextPage = 0;
    this._providersByPage = [];
    this._currentSearch = search;
    this._runSearch(search);
  }

  incrementPage(): void {
    ++this._nextPage;
    invariant(
      this._currentSearch !== null,
      'Cannot call incrementPage() unless first calling updateSearch()',
    );
    this._runSearch(this._currentSearch);
  }

  listenToSearchResults(callback: ResultCallback): Subscription {
    invariant(!this._callback, 'Only 1 listener at a time');
    this._callback = callback;
    return () => {
      this._callback = null;
    };
  }

  getProvidersPayload(): ProvidersPayload {
    const providers = [];
    this._providersByPage.forEach(_providers => {
      providers.push.apply(providers, _providers);
    });
    return this._didFailLastRun
      ? { type: 'FAILURE' }
      : { providers, type: 'SUCCESS' };
  }

  _runSearch(search: string): Promise<void> {
    const currentPage = this._nextPage;
    this._didFailLastRun = false;
    return Promise.resolve()
      .then(() => {
        this._currentSearch = search;
        return FindiService.genQueryProviders(search, LIMIT, this._nextPage);
      })
      .then(providers => {
        this._lastSuccessfulSearch = search;
        this._providersByPage[currentPage] = providers;
        this._callback && this._callback();
      })
      .catch(error => {
        this._didFailLastRun = true;
        this._callback && this._callback();
      });
  }
}
