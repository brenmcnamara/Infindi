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

    if (didLoginUser(action)) {
      const loginPayload = extractLoginPayload(action);
      accountSubscription && accountSubscription.remove();
      accountSubscription = listenForAccounts(loginPayload, next);
    } else if (willLogoutUser(action)) {
      accountSubscription && accountSubscription.remove();
      accountSubscription = null;
      clearUserData(next);
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
    .where('shouldShowUser', '==', true)
    .where('sourceOfTruth.type', '==', 'YODLEE')
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

function didLoginUser(action: PureAction): bool {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGGED_IN';
}

function extractLoginPayload(action: PureAction): LoginPayload {
  invariant(
    action.type === 'AUTH_STATUS_CHANGE' && action.status.type === 'LOGGED_IN',
    'Expected action to be AUTH_STATUS_CHANGE with LOGGED_IN status type',
  );
  return action.status.loginPayload;
}

function willLogoutUser(action: PureAction): bool {
  if (action.type !== 'AUTH_STATUS_CHANGE') {
    return false;
  }
  return action.status.type === 'LOGOUT_INITIALIZE';
}
