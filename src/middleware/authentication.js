/* @flow */

import Firebase from 'react-native-firebase';

import { type Action, type Store } from '../types/redux';
import {
  type Firebase$DataSnapshot,
  type Firebase$User,
} from '../types/firebase';
import { type UserInfo } from '../types/db';

const Auth = Firebase.auth();
const Database = Firebase.database();

export default (store: Store) => (next: Function) => {
  // Listen to firebase changes for authentication and
  // generate the relevant actions.
  Auth.onAuthStateChanged(() => {
    const user: ?Firebase$User = Auth.currentUser;
  });

  return (action: Action) => {
    // Pass through any actions that we get.
    return next(action);
  };
};

async function genUserInfo(id: string): Promise<UserInfo> {
  const path = `UserInfo/${id}`;
  // TODO: Look into what errors this may return.
  const snapshot: Firebase$DataSnapshot = await Database.ref(path).once();
  return snapshot.val();
}
