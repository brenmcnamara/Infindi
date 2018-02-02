/* @flow */

import invariant from 'invariant';

import { didLogin, willLogout } from '../common/action-utils';
import {
  getYodleeRefreshInfoCollection,
  isPending,
} from 'common/lib/models/YodleeRefreshInfo';
import { dismissToast, requestToast } from '../actions/toast';
import { hasToast } from '../store/state-utils';

import type { EmitterSubscription } from '../common/event-utils';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

type RefreshInfoCollection = ModelCollection<'YodleeRefreshInfo',
  YodleeRefreshInfo,>;

export default (store: Store) => (next: Next) => {
  let refreshInfoSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    if (didLogin(action)) {
      const loginPayload = extractLoginPayload(action);
      refreshInfoSubscription && refreshInfoSubscription.remove();
      refreshInfoSubscription = listenForRefreshInfo(store, loginPayload, next);
    } else if (willLogout(action)) {
      refreshInfoSubscription && refreshInfoSubscription.remove();
      refreshInfoSubscription = null;
      clearUserData(next);
    }
  };
};

function listenForRefreshInfo(
  store: Store,
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  next({ modelName: 'YodleeRefreshInfo', type: 'COLLECTION_DOWNLOAD_START' });
  const userID = loginPayload.firebaseUser.uid;
  const remove = getYodleeRefreshInfoCollection()
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const collection: RefreshInfoCollection = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const refreshInfo: YodleeRefreshInfo = doc.data();
        collection[refreshInfo.id] = refreshInfo;
      });
      next({
        collection,
        modelName: 'YodleeRefreshInfo',
        type: 'COLLECTION_DOWNLOAD_FINISHED',
      });

      const state = store.getState();
      if (
        containsPendingRefresh(collection) &&
        !hasToast(state, REFRESH_INFO_TOAST_ID)
      ) {
        next(requestRefreshToast());
      } else if (
        !containsPendingRefresh(collection) &&
        hasToast(state, REFRESH_INFO_TOAST_ID)
      ) {
        next(dismissRefreshToast());
      }
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'YodleeRefreshInfo', type: 'COLLECTION_CLEAR' });
}

function extractLoginPayload(action: PureAction): LoginPayload {
  invariant(
    action.type === 'AUTH_STATUS_CHANGE' && action.status.type === 'LOGGED_IN',
    'Expected action to be AUTH_STATUS_CHANGE with LOGGED_IN status type',
  );
  return action.status.loginPayload;
}

const REFRESH_INFO_TOAST_ID = 'YODLEE_REFRESH_INFO';
function requestRefreshToast() {
  return requestToast({
    bannerChannel: 'ACCOUNTS',
    bannerType: 'INFO',
    id: REFRESH_INFO_TOAST_ID,
    priority: 'LOW',
    text: 'Your accounts data is downloading',
    toastType: 'BANNER',
  });
}

function dismissRefreshToast() {
  return dismissToast(REFRESH_INFO_TOAST_ID);
}

function containsPendingRefresh(collection: RefreshInfoCollection): bool {
  for (const id in collection) {
    if (collection.hasOwnProperty(id) && isPending(collection[id])) {
      return true;
    }
  }
  return false;
}
