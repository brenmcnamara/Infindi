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

import { getLatestMode, getLoginPayload, getMode } from '../store/state-utils';

import type { Account, LoginPayload } from 'common/src/types/db';
import type { ModelCollection } from '../datastore';
import type { PureAction, Next, Store } from '../typesDEPRECATED/redux';

type EmitterSubscription = { remove: () => void };

const Database = Firebase.firestore();

export default (store: Store) => (next: Next) => {
  let currentMode = getLatestMode(store.getState());

  let accountSubscription: ?EmitterSubscription = null;

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'AUTH_STATUS_CHANGE': {
        const newMode = getMode(store.getState());
        if (currentMode === newMode) {
          return;
        }
        const modeTransition = `${currentMode} -> ${newMode}`;
        switch (modeTransition) {
          case 'LOADING -> MAIN':
          case 'AUTH -> MAIN': {
            const loginPayload = getLoginPayload(store.getState());
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

          case 'MAIN -> AUTH': {
            if (accountSubscription) {
              accountSubscription.remove();
              accountSubscription = null;
            }
            clearUserData(next);
            break;
          }

          // Here are the transition we don't care about.
          case 'AUTH -> LOADING':
          case 'MAIN -> LOADING':
          case 'LOADING -> AUTH': {
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
  console.log('REMOVE', remove);
  return { remove };
}

function clearUserData(next: Next): void {
  next({ modelName: 'Account', type: 'COLLECTION_CLEAR' });
}
