/* @flow */

import DataModelActions from '../../data-model/actions';

import invariant from 'invariant';

import { getIsAuthenticated, getLoginPayload } from '../../auth/state-utils';

import type { PureAction, Next, ReduxState, StoreType } from '../../store';

class WatchSessionMiddleware {
  _adminStatus: 'ADMIN' | 'NOT_ADMIN' | 'UNKNOWN' = 'UNKNOWN';

  _next: Next | null = null;
  _store: StoreType | null = null;

  _onAction(action: PureAction): void {
    this._callNext(action);

    if (this._adminStatus === 'NOT_ADMIN') {
      return;
    }

    const postActionState = this._getState();

    const loginPayload = getLoginPayload(postActionState);

    if (this._adminStatus === 'UNKNOWN' && loginPayload) {
      this._adminStatus = loginPayload.userInfo.isAdmin ? 'ADMIN' : 'NOT_ADMIN';
      if (this._adminStatus === 'ADMIN') {
        this._onAdminLogin();
      }
    } else if (
      this._adminStatus === 'ADMIN' &&
      !getIsAuthenticated(postActionState)
    ) {
      // Admin user logged out.
      this._adminStatus = 'UNKNOWN';
      this._onAdminLogout();
    }

    // TODO: Add logout process as well.
  }

  _onAdminLogin(): void {
    this._callNext(DataModelActions.fetchAllUsers());
  }

  _onAdminLogout(): void {
    this._callNext(DataModelActions.clearAllUsers());
  }

  getMiddlewareHandle() {
    return (store: StoreType) => (next: Next) => {
      this._store = store;
      this._next = next;
      return (action: PureAction) => {
        this._onAction(action);
      };
    };
  }

  _callNext(...args: *) {
    invariant(
      this._next,
      'Trying to use middleware before it has been linked with redux',
    );
    return this._next.apply(this._next, args);
  }

  _getState(): ReduxState {
    invariant(
      this._store,
      'Trying to use middleware before it has been linked with redux',
    );
    return this._store.getState();
  }
}

const middleware = new WatchSessionMiddleware();

export default middleware.getMiddlewareHandle();
