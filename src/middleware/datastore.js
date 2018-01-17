/* @flow */

// TODO: Why won't flow cover next functions?

/**
 * The purpose of this middleware is to coordinate the download and sync of all
 * data for the user. This includes:
 *
 * (1) Downloading and syncing data with firebase
 * (2) Downloading and syncing data with our own services
 * (3) Managing local data while in offline mode
 * (4) encrypting and storing data locally.
 *
 * NOTE: Some of the above functionality is reserved for future versions of this
 * middleware.
 */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import type { Account } from 'common/lib/models/Account';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

type EmitterSubscription = { remove: () => void };

const Database = Firebase.firestore();

export default (store: Store) => (next: Next) => {
  let accountSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'AUTH_STATUS_CHANGE': {
        const { status } = action;
        switch (status.type) {
          case 'LOGGED_IN': {
            const { loginPayload } = status;
            invariant(
              loginPayload,
              'Trying to download user data without a login payload',
            );
            if (accountSubscription) {
              accountSubscription.remove();
              accountSubscription = null;
            }
            accountSubscription = listenForAccounts(loginPayload, next);
            break;
          }

          case 'LOGOUT_INITIALIZE': {
            if (accountSubscription) {
              accountSubscription.remove();
              accountSubscription = null;
            }
            clearUserData(next);
            break;
          }
        }
      }
    }
  };
};

function listenForAccounts(
  loginPayload: LoginPayload,
  next: Next,
): EmitterSubscription {
  next({ modelName: 'Account', type: 'COLLECTION_DOWNLOAD_START' });
  const userID = loginPayload.firebaseUser.uid;
  const remove = Database.collection('Accounts')
    .where('userRef.refID', '==', userID)
    .onSnapshot(snapshot => {
      const collection: ModelCollection<*, Account> = {};
      snapshot.docs.forEach(doc => {
        if (!doc.exists) {
          return;
        }
        const account: Account = doc.data();
        collection[account.id] = account;
      });
      next({
        collection,
        modelName: 'Account',
        type: 'COLLECTION_DOWNLOAD_FINISHED',
      });
    });
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'Account', type: 'COLLECTION_CLEAR' });
}
