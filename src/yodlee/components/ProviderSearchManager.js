/* @flow */

import invariant from 'invariant';

import { genQueryProviders } from '../../backend';

import type { Provider } from 'common/lib/models/Provider';

export type ResultCallback = () => any;
export type Subscription = () => void;

const LIMIT = 20;

export default class ProviderSearchManager {
  _callback: ResultCallback | null = null;
  _currentSearch: string = '';
  _lastSuccessfulSearch: string = '';
  _nextPage: number = 0;
  _providersByPage: Array<Array<Provider>> = [];
  _runningSearch: string = '';

  clearSearch(): void {
    this._currentSearch = '';
    this._lastSuccessfulSearch = '';
    this._nextPage = 0;
    this._providersByPage = [];
    this._runningSearch = '';

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
    this._runSearch(this._currentSearch);
  }

  listenToSearchResults(callback: ResultCallback): Subscription {
    invariant(!this._callback, 'Only 1 listener at a time');
    this._callback = callback;
    return () => {
      this._callback = null;
    };
  }

  getProviders(): Array<Provider> {
    const providers = [];
    this._providersByPage.forEach(_providers => {
      providers.push.apply(providers, _providers);
    });
    return providers;
  }

  _runSearch(search: string): Promise<void> {
    const currentPage = this._nextPage;
    return Promise.resolve()
      .then(() => {
        this._currentSearch = search;
        return genQueryProviders(search, LIMIT, this._nextPage);
      })
      .then(payload => {
        this._lastSuccessfulSearch = search;
        this._providersByPage[currentPage] = payload.data;
        this._callback && this._callback();
      });
  }
}
