/* @flow */

import Colors from './src/design/colors';
import HomeScreen from './src/components/HomeScreen.react';
import Icons from './src/design/icons';
import SettingsScreen from './src/components/SettingsScreen.react';

import withAuthenticationGuard from './src/components/hoc/withAuthenticationGuard';
import withNavigatorControls from './src/components/hoc/withNavigatorControls';
import withProvider from './src/components/hoc/withProvider';

import { ButtonIDs } from './src/constants';
import { Navigation } from 'react-native-navigation';

const SettingsListButton = {
  disableIconTint: true,
  icon: Icons.List,
  id: ButtonIDs.SETTINGS_BUTTON,
};

const ConverseButton = {
  disableIconTint: true,
  icon: Icons.InfindiLogoNavBar,
  id: ButtonIDs.CONVERSE_BUTTON,
};

Navigation.registerComponent('Home', () =>
  withProvider(withNavigatorControls(HomeScreen)),
);
// withProvider(withAuthenticationGuard(withNavigatorControls(HomeScreen))),
// );

Navigation.registerComponent('Settings', () => withProvider(SettingsScreen));

Navigation.startTabBasedApp({
  drawer: {
    animationType: 'wunder-list',
    left: {
      screen: 'Settings',
    },
    style: {
      contentOverlayColor: 'rgba(0, 0, 0, 0.1)',
      leftDrawerWidth: 60, // Percent
    },
    type: 'TheSideBar',
  },

  tabs: [
    {
      icon: Icons.Home,
      label: 'Home',
      navigatorButtons: {
        leftButtons: [SettingsListButton],
        rightButtons: [ConverseButton],
      },
      navigatorStyle: {
        navBarBackgroundColor: Colors.BACKGROUND,
        navBarNoBorder: true,
      },
      screen: 'Home',
    },
  ],

  tabsStyle: {
    tabBarBackgroundColor: '#FFFFFF',
  },
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
