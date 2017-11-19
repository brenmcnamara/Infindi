/* @flow */

import Firebase from 'react-native-firebase';

import {
  type Firebase$DataSnapshot,
  type Firebase$User,
} from './types/firebase';
import { type UserInfo } from './types/db';

const Auth = Firebase.auth();
const Database = Firebase.database();

// -----------------------------------------------------------------------------
//
// INITIALIZATION
//
// -----------------------------------------------------------------------------

export function initialize(): void {}

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
  const path = `UserInfo/${firebaseUser.uid}`;
  // TODO: Look into what errors this may return.
  const snapshot: Firebase$DataSnapshot = await Database.ref(path).once();
  const userInfo: UserInfo = snapshot.val();
  return { firebaseUser, userInfo };
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------
