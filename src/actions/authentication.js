/* @flow */

import Firebase from 'react-native-firebase';

import { type Dispatch } from '../types/redux';

export type Action = Action$LoginInitialize | Action$LogoutInitialize;

type Action$LoginInitialize = {|
  +type: 'LOGIN_INITIALIZE',
|};

export function login(email: string, password: string) {
  return (dispatch: Dispatch) => {
    // This function is a pure side effect (does not dispatch any actions).
    // Letting the authentication middleware pick up on the changes.
    Firebase.auth().signInWithEmailAndPassword(email, password);
    dispatch({ type: 'LOGIN_INITIALIZE' });
  };
}

type Action$LogoutInitialize = {|
  +type: 'LOGOUT_INITIALIZE',
|};

export function logout() {
  return (dispatch: Dispatch) => {
    // This function is a pure side effect (does not dispatch any actions).
    // Letting the authentication middleware pick up on the changes.
    Firebase.auth().signOut();
    dispatch({ type: 'LOGOUT_INITIALIZE' });
  };
}
