/* @flow */

import AppContainer from './src/components/AppContainer.react';
import Common from 'common';
import Firebase from 'react-native-firebase';

import { AppRegistry } from 'react-native';

Common.initialize(Firebase);
AppRegistry.registerComponent('Infindi', () => AppContainer);

// -----------------------------------------------------------------------------
//
// DEBUGGER GLOBALS
//
// -----------------------------------------------------------------------------

import Store from './src/store';

import { login, logout } from './src/actions/authentication';

if (__DEV__) {
  const TEST_EMAIL = 'infindi.testing@gmail.com';
  const TEST_PWORD = 'public_password2';

  global.loginTestUser = () => {
    Store.dispatch(login({ email: TEST_EMAIL, password: TEST_PWORD }));
  };

  global.logout = () => {
    Store.dispatch(logout());
  };
}
