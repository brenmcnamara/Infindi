/* @flow */

import invariant from 'invariant';

import { didLogin, willLogout } from '../common/action-utils';
import { getYodleeRefreshInfoCollection } from 'common/lib/models/YodleeRefreshInfo';

import type { EmitterSubscription } from '../common/event-utils';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';
import type { YodleeRefreshInfo } from 'common/lib/models/YodleeRefreshInfo';

export default (store: Store) => (next: Next) => {
  let refreshInfoSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    if (didLogin(action)) {
      const loginPayload = extractLoginPayload(action);
      refreshInfoSubscription && refreshInfoSubscription.remove();
      refreshInfoSubscription = listenForRefreshInfo(loginPayload, next);
    } else if (willLogout(action)) {
      refreshInfoSubscription && refreshInfoSubscription.remove();
      refreshInfoSubscription = null;
      clearUserData(next);
    }
  };
};

function listenForRefreshInfo(
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  next({ modelName: 'YodleeRefreshInfo', type: 'COLLECTION_DOWNLOAD_START' });
  const userID = loginPayload.firebaseUser.uid;
  const remove = getYodleeRefreshInfoCollection()
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const collection: ModelCollection<'YodleeRefreshInfo',
        YodleeRefreshInfo,> = {};
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
