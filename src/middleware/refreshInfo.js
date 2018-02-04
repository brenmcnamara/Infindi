/* @flow */

import invariant from 'invariant';

import { didLogin, willLogout } from '../common/action-utils';
import { dismissToast, requestToast } from '../actions/toast';
import { getYodleeRefreshInfoCollection, getToast } from '../store/state-utils';
import {
  didFail,
  getYodleeRefreshInfoCollection as getYodleeRefreshInfoFirebaseCollectionRef,
  isPending,
} from 'common/lib/models/YodleeRefreshInfo';
import { AccountsDownloadingBanner, ProviderLoginBanner } from '../../content';

import type { EmitterSubscription } from '../common/event-utils';
import type { ID } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

type ProviderBannerStatus = 'IN_PROGRESS' | 'SUCCESS' | 'ERROR';
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
  const remove = getYodleeRefreshInfoFirebaseCollectionRef()
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const nextRefreshInfo: RefreshInfoCollection = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const refreshInfo: YodleeRefreshInfo = doc.data();
        nextRefreshInfo[refreshInfo.id] = refreshInfo;
      });

      const state = store.getState();
      if (
        containsPendingRefresh(nextRefreshInfo) &&
        getToast(state, REFRESH_INFO_TOAST_ID) === null
      ) {
        next(requestAccountsBanner());
      } else if (
        !containsPendingRefresh(nextRefreshInfo) &&
        getToast(state, REFRESH_INFO_TOAST_ID) !== null
      ) {
        next(dismissAccountsBanner());
      }

      // Go through the refresh info and check for any changes.
      const prevRefreshInfo = getYodleeRefreshInfoCollection(state);
      const delta = calculateProviderDelta(prevRefreshInfo, nextRefreshInfo);

      for (let providerID in delta) {
        if (!delta.hasOwnProperty(providerID)) {
          return;
        }
        const change = delta[providerID];
        if (change.to === null) {
          next(dismissProviderBanner(providerID));
        } else {
          dispatchRequestProviderBanner(next, store, providerID, change.to);
        }
      }
      // Update the refresh info collection.
      next({
        collection: nextRefreshInfo,
        modelName: 'YodleeRefreshInfo',
        type: 'COLLECTION_DOWNLOAD_FINISHED',
      });
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

function requestAccountsBanner() {
  return requestToast({
    bannerChannel: 'ACCOUNTS',
    bannerType: 'INFO',
    id: REFRESH_INFO_TOAST_ID,
    priority: 'LOW',
    text: AccountsDownloadingBanner,
    toastType: 'BANNER',
  });
}

function dismissAccountsBanner() {
  return dismissToast(REFRESH_INFO_TOAST_ID);
}

function dispatchRequestProviderBanner(
  next: Next,
  store: Store,
  providerID: ID,
  status: ProviderBannerStatus,
) {
  const id = `PROVIDERS/${providerID}`;
  const toast = getToast(store.getState(), id);
  if (toast) {
    next(dismissToast(id));
  }
  next(
    requestToast({
      bannerChannel: id,
      bannerType:
        status === 'ERROR'
          ? 'ERROR'
          : status === 'SUCCESS' ? 'SUCCESS' : 'INFO',
      id,
      priority: 'LOW',
      text: ProviderLoginBanner[status],
      toastType: 'BANNER',
    }),
  );
}

function dismissProviderBanner(providerID: ID) {
  return dismissToast(`PROVIDERS/${providerID}`);
}

function containsPendingRefresh(collection: RefreshInfoCollection): bool {
  for (const id in collection) {
    if (collection.hasOwnProperty(id) && isPending(collection[id])) {
      return true;
    }
  }
  return false;
}

function calculateProviderDelta(
  prevRefreshInfo: RefreshInfoCollection,
  nextRefreshInfo: RefreshInfoCollection,
) {
  const processedIDs = {};
  const deltaCollection = {};

  for (const id in prevRefreshInfo) {
    if (prevRefreshInfo.hasOwnProperty(id)) {
      const prevStatus = getBannerStatus(prevRefreshInfo[id]);
      const nextStatus = nextRefreshInfo[id]
        ? getBannerStatus(nextRefreshInfo[id])
        : null;
      const providerID = prevRefreshInfo[id].providerRef.refID;
      deltaCollection[providerID] = { from: prevStatus, to: nextStatus };
      processedIDs[providerID] = true;
    }
  }

  for (const id in nextRefreshInfo) {
    if (nextRefreshInfo.hasOwnProperty(id)) {
      const providerID = nextRefreshInfo[id].providerRef.refID;
      if (processedIDs[providerID]) {
        continue;
      }
      const nextStatus = getBannerStatus(nextRefreshInfo[id]);
      deltaCollection[providerID] = { from: null, to: nextStatus };
    }
  }

  return deltaCollection;
}

function getBannerStatus(info: YodleeRefreshInfo): ProviderBannerStatus {
  return isPending(info) ? 'IN_PROGRESS' : didFail(info) ? 'ERROR' : 'SUCCESS';
}
