/* @flow */

import Firebase from 'react-native-firebase';

const Auth = Firebase.auth();

type User = Object; // TODO

export type LoginErrorCode =
  | 'auth/invalid-email'
  | 'auth/user-disabled'
  | 'auth/user-not-found'
  | 'auth/wrong-password';

export type LoginError = {
  code: LoginErrorCode,
  message: string,
};

export async function genLogin(email: string, password: string): Promise<User> {
  return await Auth.signInWithEmailAndPassword(email, password);
}
