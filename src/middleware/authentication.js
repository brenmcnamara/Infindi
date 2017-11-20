/* @flow */

import Firebase from 'react-native-firebase';

import { type Action as AllActions, type Store } from '../types/redux';
import { type AuthStatus } from '../reducers/authStatus';
import {
  type Firebase$DataSnapshot,
  type Firebase$User,
} from '../types/firebase';
import { type UserInfo } from '../types/db';

const Auth = Firebase.auth();
const Database = Firebase.database();

export type Action = Action$AuthStatusChange;

export type Action$AuthStatusChange = {|
  +authStatus: AuthStatus,
  +type: 'AUTH_STATUS_CHANGE',
|};

export default (store: Store) => (next: Function) => {
  // Listen to firebase changes for authentication and
  // generate the relevant actions.
  Auth.onAuthStateChanged(async () => {
    const authStatus: AuthStatus = store.getState().authStatus;
    const firebaseUser: ?Firebase$User = Auth.currentUser;
    if (
      firebaseUser &&
      (authStatus.type === 'LOGIN_INITIALIZED' ||
        authStatus.type === 'NOT_INITIALIZED')
    ) {
      const userInfo = await genUserInfo(firebaseUser.uid);
      next({ type: 'LOGIN', payload: { firebaseUser, userInfo } });
    } else if (
      !firebaseUser &&
      (authStatus.type === 'LOGOUT_INITIALIZE' ||
        authStatus.type === 'NOT_INITIALIZED')
    ) {
      next({ type: 'LOGOUT' });
    }
  });

  return (action: AllActions) => {
    if (action.type === 'LOGIN_INITIALIZE') {
      const { email, password } = action;
      Auth.signInWithEmailAndPassword(email, password).catch(error => {
        console.log('login error!', error.code);
      });
    } else if (action.type === 'LOGOUT_INITIALIZE') {
      Auth.signOut().catch(error => {
        console.log('logout error!', error.code);
      });
    }
    // Pass through any actions that we get and listen for any
    // authentication actions where we would need to trigger
    // some firebase login process.
    return next(action);
  };
};

async function genUserInfo(id: string): Promise<UserInfo> {
  const path = `UserInfo/${id}`;
  // TODO: Look into what errors this may return.
  const snapshot: Firebase$DataSnapshot = await Database.ref(path).once();
  return snapshot.val();
}
