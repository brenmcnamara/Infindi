/* @flow */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import { didLogin, willLogout } from '../common/action-utils';
// eslint-disable-next-line max-len
import { getAccountLinkCollection as getAccountLinkModelCollection } from 'common/lib/models/AccountLink';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { EmitterSubscription } from '../common/event-utils';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

type AccountLinkCollection = ModelCollection<'AccountLink', AccountLink>;

export default (store: Store) => (next: Next) => {
  let accountLinkSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    if (didLogin(action)) {
      const loginPayload = extractLoginPayload(action);
      accountLinkSubscription && accountLinkSubscription.remove();
      accountLinkSubscription = listenForAccountLink(store, loginPayload, next);
    } else if (willLogout(action)) {
      accountLinkSubscription && accountLinkSubscription.remove();
      accountLinkSubscription = null;
      clearUserData(next);
    }
  };
};

function listenForAccountLink(
  store: Store,
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  next({ modelName: 'AccountLink', type: 'COLLECTION_DOWNLOAD_START' });
  const userID = loginPayload.firebaseUser.uid;
  const remove = getAccountLinkModelCollection()
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const collection: AccountLinkCollection = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const accountLink: AccountLink = doc.data();
        collection[accountLink.id] = accountLink;
      });

      // Update the refresh info collection.
      next({
        collection,
        modelName: 'AccountLink',
        type: 'COLLECTION_DOWNLOAD_FINISHED',
      });
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'AccountLink', type: 'COLLECTION_CLEAR' });
}

function extractLoginPayload(action: PureAction): LoginPayload {
  invariant(
    action.type === 'AUTH_STATUS_CHANGE' && action.status.type === 'LOGGED_IN',
    'Expected action to be AUTH_STATUS_CHANGE with LOGGED_IN status type',
  );
  return action.status.loginPayload;
}
