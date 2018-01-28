/* @flow */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import { handleNetworkRequest } from '../common/middleware-utils';
import { initialize as initializeBackend } from '../backend';

import type { Action as AllActions, Store } from '../typesDEPRECATED/redux';
import type { AuthStatus } from '../reducers/authStatus';
import type { User as FirebaseUser } from 'common/types/firebase';
import type { LoginCredentials, LoginPayload } from 'common/lib/models/Auth';
import type { UserInfo } from 'common/lib/models/UserInfo';

type EmitterSubscription = { remove: () => void };

const Auth = Firebase.auth();
const Database = Firebase.firestore();

export type Action = Action$AuthStatusChange;

export type Action$AuthStatusChange = {|
  +status: AuthStatus,
  +type: 'AUTH_STATUS_CHANGE',
|};

type ChangeStatus = (authStatus: AuthStatus) => *;

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
    const authStatus = store.getState().authStatus;
    const loginPayload: ?LoginPayload = await genLoginPayload();

    if (canLogin(authStatus) && loginPayload) {
      initializeBackend(loginPayload);
      changeStatus({ loginPayload, type: 'LOGGED_IN' });
    } else if (canLogout(authStatus) && !loginPayload) {
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
        handleNetworkRequest(store, next, 'firebase.auth.login', () =>
          genPerformLogin(loginCredentials, changeStatus),
        );
        break;
      }

      case 'LOGOUT_REQUEST': {
        const authStatus = store.getState().authStatus;
        const loginPayload = getLoginPayload(authStatus);
        invariant(
          loginPayload,
          'Requesting logout of a user that is not logged in',
        );
        handleNetworkRequest(store, next, 'firebase.auth.logout', () =>
          genPerformLogout(loginPayload, changeStatus),
        );
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
  const document = await Database.collection('UserInfo')
    .doc(id)
    .get();
  invariant(
    document.exists,
    'Data Error: UserInfo is missing for logged in user',
  );
  return document.data();
}

async function genLoginPayload(): Promise<?LoginPayload> {
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

function getLoginPayload(authStatus: AuthStatus): ?LoginPayload {
  switch (authStatus.type) {
    case 'LOGGED_IN':
      return authStatus.loginPayload;
    default:
      return null;
  }
}

function canLogin(authStatus: AuthStatus): bool {
  return (
    authStatus.type === 'NOT_INITIALIZED' ||
    authStatus.type === 'LOGIN_INITIALIZE'
  );
}

function canLogout(authStatus: AuthStatus): bool {
  return (
    authStatus.type === 'NOT_INITIALIZED' ||
    authStatus.type === 'LOGOUT_INITIALIZE'
  );
}
