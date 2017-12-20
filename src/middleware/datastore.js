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

const Database = Firebase.firestore();

export default (store: Store) => (next: Next) => {
  let currentMode = getLatestMode(store.getState());

  return (action: PureAction) => {
    next(action);

    switch (action.type) {
      case 'AUTH_STATUS_CHANGE': {
        const newMode = getMode(store.getState());
        if (currentMode === newMode) {
          return;
        }
        const modeTransition = `${currentMode} -> ${newMode}`;
        console.log('handling mode transition in datastore');
        switch (modeTransition) {
          case 'LOADING -> MAIN':
          case 'AUTH -> MAIN': {
            const loginPayload = getLoginPayload(store.getState());
            invariant(
              loginPayload,
              'Trying to download user data without a login payload',
            );
            downloadInitialUserData(loginPayload, next);
            break;
          }

          case 'MAIN -> AUTH': {
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

async function downloadInitialUserData(loginPayload: LoginPayload, next: Next) {
  // TODO: Add limit to download.
  next({ modelName: 'Account', type: 'COLLECTION_DOWNLOAD_START' });
  let snapshot;
  try {
    snapshot = await Database.collection('Accounts')
      .where('userRef.refID', '==', loginPayload.firebaseUser.uid)
      .get();
  } catch (firebaseError /* Firebase Error */) {
    const errorCode = firebaseError.code;
    const errorMessage = firebaseError.message;
    const error = { errorCode, errorMessage };
    next({ error, modelName: 'Account', type: 'COLLECTION_DOWNLOAD_FAILURE' });
    return;
  }

  const allDocsExist = snapshot.docs.every(doc => doc.exists);
  if (!allDocsExist) {
    // TODO: Document this error code.
    const error = {
      errorCode: 'infindi/bad-data',
      errorMessage: 'Expect all Account docs to exist',
    };
    next({ error, modelName: 'Account', type: 'COLLECTION_DOWNLOAD_FAILURE' });
    return;
  }

  const collection: ModelCollection<'Account', Account> = {};
  snapshot.docs.forEach(document => {
    const account: Account = document.data();
    collection[account.id] = account;
  });
  // $FlowFixMe - Will fix this later.
  next({
    collection,
    modelName: 'Account',
    type: 'COLLECTION_DOWNLOAD_FINISHED',
  });
}

function clearUserData(next: Next): void {
  next({ modelName: 'Account', type: 'COLLECTION_CLEAR' });
}
