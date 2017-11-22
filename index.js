/* @flow */

import Colors from './src/design/colors';
import HomeScreen from './src/components/HomeScreen.react';
import Icons from './src/design/icons';

import withProvider from './src/components/hoc/withProvider';

import { Navigation } from 'react-native-navigation';

const SettingsListButton = {
  disableIconTint: true,
  icon: Icons.List,
};

const ConverseButton = {
  disableIconTint: true,
  icon: Icons.InfindiLogoNavBar,
};

Navigation.registerComponent('Home', () => withProvider(HomeScreen));

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      navigatorButtons: {
        leftButtons: [SettingsListButton],
        rightButtons: [ConverseButton],
      },
      navigatorStyle: {
        navBarBackgroundColor: Colors.BACKGROUND_COLOR,
        navBarNoBorder: true,
      },
      screen: 'Home',
    },
  ],
});

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
