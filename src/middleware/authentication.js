/* @flow */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import { initialize as initializeBackend } from '../backend';

import type { Action as AllActions, Store } from '../typesDEPRECATED/redux';
import type { AuthStatus } from '../reducers/authStatus';
import type { Firebase$User } from 'common/src/types/firebase';
import type { ID } from 'common/src/types/core';
import type {
  LoginCredentials,
  LoginPayload,
  UserInfo,
  UserMetrics,
} from 'common/src/types/db';

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
        return performLogin(loginCredentials, changeStatus);
      }

      case 'LOGOUT_REQUEST': {
        const authStatus = store.getState().authStatus;
        const loginPayload = getLoginPayload(authStatus);
        invariant(
          loginPayload,
          'Requesting logout of a user that is not logged in',
        );
        return performLogout(loginPayload, changeStatus);
      }
    }
  };
};

// -----------------------------------------------------------------------------
//
// SIDE EFFECT TRIGGERS
//
// -----------------------------------------------------------------------------

function performLogin(
  loginCredentials: LoginCredentials,
  changeStatus: ChangeStatus,
) {
  const { email, password } = loginCredentials;
  // NOTE: Login auth state will automatically be detected in
  // "onAuthStateChanged" from above.
  Auth.signInWithEmailAndPassword(email, password).catch(error => {
    changeStatus({ errorCode: error.code, type: 'LOGIN_FAILURE' });
  });
  return changeStatus({ loginCredentials, type: 'LOGIN_INITIALIZE' });
}

function performLogout(loginPayload: LoginPayload, changeStatus: ChangeStatus) {
  // NOTE: Login auth state will automatically be detected in
  // "onAuthStateChanged" from above.
  Auth.signOut().catch(error => {
    changeStatus({ errorCode: error.code, type: 'LOGOUT_FAILURE' });
  });
  return changeStatus({ type: 'LOGOUT_INITIALIZE' });
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

async function genUserMetrics(id: ID): Promise<UserMetrics> {
  const document = await Database.collection('UserMetrics')
    .doc(id)
    .get();
  invariant(
    document.exists,
    'Data Error: UserMetrics is missing for logged in user',
  );
  return document.data();
}

async function genLoginPayload(): Promise<?LoginPayload> {
  const firebaseUser: Firebase$User = Auth.currentUser;
  if (!firebaseUser) {
    return null;
  }
  const [userInfo, userMetrics, idToken] = await Promise.all([
    genUserInfo(firebaseUser.uid),
    genUserMetrics(firebaseUser.uid),
    firebaseUser.getIdToken(),
  ]);
  return { firebaseUser, idToken, userInfo, userMetrics };
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
