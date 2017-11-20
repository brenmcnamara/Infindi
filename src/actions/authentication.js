/* @flow */

import Firebase from 'react-native-firebase';

export function login(email: string, password: string) {
  return () => {
    // This function is a pure side effect (does not dispatch any actions).
    // Letting the authentication middleware pick up on the changes.
    Firebase.auth().signInWithEmailAndPassword(email, password);
  };
}

export function logout() {
  return () => {
    // This function is a pure side effect (does not dispatch any actions).
    // Letting the authentication middleware pick up on the changes.
    Firebase.auth().signOut();
  };
}
