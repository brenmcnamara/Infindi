/* @flow */

import Firebase from 'react-native-firebase';

import invariant from 'invariant';

import {
  type Firebase$DataSnapshot,
  type Firebase$User,
} from './types/firebase';
import { type Subscription } from './types/pubSub';
import { type UserInfo } from './types/db';

const Auth = Firebase.auth();
const Database = Firebase.database();

// -----------------------------------------------------------------------------
//
// LOCAL STATE
//
// -----------------------------------------------------------------------------

let authChangeSubscription: ?Subscription = null;
let loginStatus: LoginStatus = { type: 'AUTHENTICATION_NOT_INITIALIZED' };
let loginStatusChangeCallbacks: Array<LoginStatusChangeCallback> = [];

// -----------------------------------------------------------------------------
//
// INITIALIZATION
//
// -----------------------------------------------------------------------------

export function initialize(): void {
  invariant(
    !authChangeSubscription,
    'authentication module for infindi-core has already been initialized. Cannot initialize again',
  );

  const remove = Auth.onAuthStateChanged(async () => {
    const prevLoginStatus = loginStatus;
    const firebaseUser: Firebase$User = Auth.currentUser;
    if (firebaseUser) {
      const userInfo = await genUserInfo(firebaseUser.uid);
      loginStatus = {
        type: 'LOGGED_IN',
        payload: { firebaseUser, userInfo },
      };
    } else {
      loginStatus = { type: 'LOGGED_OUT' };
    }
    if (didLoginStatusChange(prevLoginStatus, loginStatus)) {
      loginStatusChangeCallbacks.forEach(cb => cb(loginStatus));
    }
  });

  authChangeSubscription = { remove };
}

export function destroy(): void {
  if (authChangeSubscription) {
    authChangeSubscription.remove();
    authChangeSubscription = null;
  }
}

// -----------------------------------------------------------------------------
//
// SUBSCRIPTION
//
// -----------------------------------------------------------------------------

export type LoginStatusChangeCallback = (status: LoginStatus) => any;

export function onLoginStatusChanged(
  callback: LoginStatusChangeCallback,
): Subscription {
  loginStatusChangeCallbacks.push(callback);
  return {
    remove: () => {
      const index = loginStatusChangeCallbacks.indexOf(callback);
      if (index >= 0) {
        loginStatusChangeCallbacks.splice(index, 1);
      }
    },
  };
}

// -----------------------------------------------------------------------------
//
// LOGIN
//
// -----------------------------------------------------------------------------

export type LoginErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

export type LoginError = {|
  +code: LoginErrorCode,
  +message: string,
|};

export type LoginPayload = {|
  +firebaseUser: Firebase$User,
  +userInfo: UserInfo,
|};

export async function genLogin(
  email: string,
  password: string,
): Promise<LoginPayload> {
  const firebaseUser = await Auth.signInWithEmailAndPassword(email, password);
  const userInfo = await genUserInfo(firebaseUser.uid);
  return { firebaseUser, userInfo };
}

// -----------------------------------------------------------------------------
//
// LOGIN STATUS
//
// -----------------------------------------------------------------------------

export type LoginStatus =
  | { type: 'LOGGED_OUT' }
  | { type: 'AUTHENTICATION_NOT_INITIALIZED' }
  | { type: 'LOGGED_IN', payload: LoginPayload };

export function getLoginStatus(): LoginStatus {
  return loginStatus;
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

async function genUserInfo(id: string): Promise<UserInfo> {
  const path = `UserInfo/${id}`;
  // TODO: Look into what errors this may return.
  const snapshot: Firebase$DataSnapshot = await Database.ref(path).once();
  return snapshot.val();
}

function didLoginStatusChange(
  prevStatus: LoginStatus,
  status: LoginStatus,
): bool {
  if (status.type !== prevStatus.type) {
    return true;
  }
  if (status.type !== 'LOGGED_IN') {
    // prev and current same status, user not logged in.
    return false;
  }
  // Check if we went from one user being logged in to a different user being
  // logged in.
  invariant(status.type === 'LOGGED_IN' && prevStatus.type === 'LOGGED_IN');
  return (
    status.payload.firebaseUser.uid !== prevStatus.payload.firebaseUser.uid
  );
}
