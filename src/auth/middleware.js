/* @flow */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import { initialize as initializeBackend } from '../backend';

import type { Action as AllActions, Store } from '../typesDEPRECATED/redux';
import type { AuthStatus } from './types';
import type { User as FirebaseUser } from 'common/types/firebase';
import type { LoginCredentials, LoginPayload } from 'common/lib/models/Auth';
import type { UserInfo } from 'common/lib/models/UserInfo';

const Auth = Firebase.auth();
const Database = Firebase.firestore();

type ChangeStatus = (auth: AuthStatus) => *;

// -----------------------------------------------------------------------------
//
// AUTHENTICATION MIDDLEWARE
//
// -----------------------------------------------------------------------------

export default (store: Store) => (next: Function) => {
  // Convenience function.
  const changeStatus = (status: AuthStatus) => {
    return next({ type: 'AUTH_STATUS_CHANGE', status });
  };
  // Listen to firebase changes for authentication and
  // generate the relevant actions.
  Auth.onAuthStateChanged(async () => {
    const { auth } = store.getState();
    const loginPayload: ?LoginPayload = await genLoginPayload();

    if (canLogin(auth) && loginPayload) {
      initializeBackend(loginPayload);
      changeStatus({ loginPayload, type: 'LOGGED_IN' });
    } else if (canLogout(auth) && !loginPayload) {
      changeStatus({ type: 'LOGGED_OUT' });
    }
  });

  // Handle the stream of actions that are coming in. Watch for any
  // authentication-related actions that require some authentication trigger
  // to get called.
  return (action: AllActions) => {
    next(action);

    switch (action.type) {
      case 'LOGIN_REQUEST': {
        const { loginCredentials } = action;
        genPerformLogin(loginCredentials, changeStatus);
        break;
      }

      case 'LOGOUT_REQUEST': {
        const { auth } = store.getState();
        const loginPayload = getLoginPayload(auth);
        invariant(
          loginPayload,
          'Requesting logout of a user that is not logged in',
        );
        genPerformLogout(loginPayload, changeStatus);
        break;
      }
    }
  };
};

// -----------------------------------------------------------------------------
//
// SIDE EFFECT TRIGGERS
//
// -----------------------------------------------------------------------------

function genPerformLogin(
  loginCredentials: LoginCredentials,
  changeStatus: ChangeStatus,
) {
  const promise = new Promise(resolve => {
    changeStatus({ loginCredentials, type: 'LOGIN_INITIALIZE' });
    resolve();
  });
  return promise
    .then(() => {
      const { email, password } = loginCredentials;
      return Auth.signInWithEmailAndPassword(email, password);
    })
    .catch(error => {
      // TODO: Error could be of different format. Need to perform error transform.
      changeStatus({ errorCode: error.code, type: 'LOGIN_FAILURE' });
    });
}

function genPerformLogout(
  loginPayload: LoginPayload,
  changeStatus: ChangeStatus,
): Promise<void> {
  // NOTE: Login auth state will automatically be detected in
  // "onAuthStateChanged" from above.
  const promise = new Promise(resolve => {
    changeStatus({ type: 'LOGOUT_INITIALIZE' });
    resolve();
  });
  return promise
    .then(() => {
      return Auth.signOut();
    })
    .catch(error => {
      // TODO: Error could be of different format. Need to perform error transform.
      changeStatus({ errorCode: error.code, type: 'LOGOUT_FAILURE' });
    });
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

async function genUserInfo(id: string): Promise<UserInfo> {
  // TODO: Look into what errors this may return.
  // $FlowFixMe - Do not understand this flow error.
  const document = await Database.collection('UserInfo')
    .doc(id)
    .get();
  invariant(
    document.exists,
    'Data Error: UserInfo is missing for logged in user',
  );
  const userInfo: UserInfo = document.data();
  return userInfo;
}

async function genLoginPayload(): Promise<?LoginPayload> {
  // $FlowFixMe - This is fine.
  const firebaseUser: FirebaseUser = Auth.currentUser;
  if (!firebaseUser) {
    return null;
  }
  const [userInfo, idToken] = await Promise.all([
    genUserInfo(firebaseUser.uid),
    firebaseUser.getIdToken(),
  ]);
  return { firebaseUser, idToken, userInfo };
}

function getLoginPayload(auth: AuthStatus): ?LoginPayload {
  switch (auth.type) {
    case 'LOGGED_IN':
      return auth.loginPayload;
    default:
      return null;
  }
}

function canLogin(auth: AuthStatus): boolean {
  return auth.type === 'NOT_INITIALIZED' || auth.type === 'LOGIN_INITIALIZE';
}

function canLogout(auth: AuthStatus): boolean {
  return auth.type === 'NOT_INITIALIZED' || auth.type === 'LOGOUT_INITIALIZE';
}
