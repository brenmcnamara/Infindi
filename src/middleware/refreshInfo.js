/* @flow */

import invariant from 'invariant';

import { didLogin, willLogout } from '../common/action-utils';
// eslint-disable-next-line max-len
import { getYodleeRefreshInfoCollection as getYodleeRefreshInfoFirebaseCollectionRef } from 'common/lib/models/YodleeRefreshInfo';

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
