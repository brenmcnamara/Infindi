/* @flow */

import FindiError from 'common/lib/FindiError';
import Immutable from 'immutable';

import invariant from 'invariant';
import uuid from 'uuid/v4';

import type { ID } from 'common/types/core';
import type { Next, PureAction, ReduxState, StoreType } from '.';

export type Action<T> =
  | Action$RequestFailure
  | Action$RequestInitialize<T>
  | Action$RequestSuccess<T>;

export type Action$RequestInitialize<T> = {|
  +genInvoke: () => Promise<T>,
  +requestID: ID,
  +type: 'REQUEST_INITIALIZE',
|};

export type Action$RequestSuccess<T> = {|
  +requestID: ID,
  +type: 'REQUEST_SUCCESS',
  +value: T,
|};

export type Action$RequestFailure = {|
  +error: FindiError,
  +requestID: ID,
  +type: 'REQUEST_FAILURE',
|};

export default class NetworkRequestMiddleware {
  _next: Next | null = null;
  _latestRunningRequests: Immutable.Map<ID, ID> = Immutable.Map();
  _store: StoreType | null = null;

  _handleAction(action: PureAction): void {
    this._dispatch(action);

    if (action.type === 'REQUEST_INITIALIZE') {
      const { genInvoke, requestID } = action;
      const instanceID = uuid();
      this._runRequest(requestID, instanceID, genInvoke);
    }
  }

  // TODO: There are probably flow errors here.
  _runRequest<T>(
    requestID: ID,
    instanceID: ID,
    genInvoke: () => Promise<T>,
  ): void {
    this._latestRunningRequests = this._latestRunningRequests.set(
      requestID,
      instanceID,
    );
    genInvoke()
      .then(value => {
        if (!this._latestRunningRequests.has(requestID)) {
          // If we have no running requests with this particular id, that means
          // we ran a request after this one, and it completed earlier. We do
          // not want to override the result of that request, so we will abort
          // this request.
          return;
        }
        // $FlowFixMe - I don't have a way currently to precisely type this.
        this._dispatch({
          requestID,
          type: 'REQUEST_SUCCESS',
          value,
        });
        if (this._latestRunningRequests.get(requestID) === instanceID) {
          // If this instance is the last request to run for the given request
          // id, then we should delete the requestID to indicate there are
          // no more requests running. There could be requests that started
          // after this request started. In that case, we should not delete
          // the request id and let those requests finish.
          this._latestRunningRequests = this._latestRunningRequests.delete(
            requestID,
          );
        }
      })
      .catch(error => {
        if (!this._latestRunningRequests.has(requestID)) {
          // If we have no running requests with this particular id, that means
          // we ran a request after this one, and it completed earlier. We will
          // ignore the error in this case to avoid having errors show for
          // stale requests.
          return;
        }
        const findiError = FindiError.fromUnknownEntity(error);
        // $FlowFixMe - I don't have a way currently to precisely type this.
        this._dispatch({
          error: findiError,
          requestID,
          type: 'REQUEST_FAILURE',
        });
        if (this._latestRunningRequests.get(requestID) === instanceID) {
          // If this instance is the last request to run for the given request
          // id, then we should delete the requestID to indicate there are
          // no more requests running. There could be requests that started
          // after this request started. In that case, we should not delete
          // the request id and let those requests finish.
          this._latestRunningRequests = this._latestRunningRequests.delete(
            requestID,
          );
        }
      });
  }

  _dispatch(action: PureAction): void {
    invariant(
      this._next,
      'Cannot call "_dispatch" until the middleware has been connected to redux',
    );
    this._next(action);
  }

  _getState(): ReduxState {
    invariant(
      this._store,
      'Cannot call "_getState" until the middleware has been connected to redux',
    );
    return this._store.getState();
  }

  handle = (store: StoreType) => (next: Next) => {
    this._store = store;
    this._next = next;

    return (action: PureAction) => {
      this._handleAction(action);
    };
  };
}
