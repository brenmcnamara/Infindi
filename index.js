/* @flow */

import Colors from './src/design/colors';
import HomeScreen from './src/components/HomeScreen.react';
import Icons from './src/design/icons';
import LoadingScreen from './src/components/LoadingScreen.react';
import LoginScreen from './src/components/LoginScreen.react';
import SettingsScreen from './src/components/SettingsScreen.react';
import Store from './src/store';

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
Navigation.registerComponent('Loading', () =>
  withProvider(withNavigatorControls(LoadingScreen)),
);
Navigation.registerComponent('Login', () =>
  withProvider(withNavigatorControls(LoginScreen)),
);
Navigation.registerComponent('Settings', () => withProvider(SettingsScreen));

type AppType = 'LOADING' | 'AUTH' | 'MAIN';

let appType: AppType = 'LOADING';

Store.subscribe(() => {
  const { authStatus } = Store.getState();
  const newAppType =
    authStatus.type === 'LOGGED_IN'
      ? 'MAIN'
      : authStatus.type === 'NOT_INITIALIZED' ? 'LOADING' : 'AUTH';
  if (appType !== newAppType) {
    changeAppType(newAppType);
    appType = newAppType;
  }
});

function changeAppType(appType: AppType) {
  if (appType === 'LOADING') {
    Navigation.startSingleScreenApp({
      screen: {
        navigatorStyle: {
          navBarHidden: true,
        },
        screen: 'Loading',
      },
    });
  } else if (appType === 'AUTH') {
    Navigation.startSingleScreenApp({
      screen: {
        navigatorStyle: {
          navBarHidden: true,
        },
        screen: 'Login',
      },
    });
  } else {
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
  }
}

// -----------------------------------------------------------------------------
//
// DEBUGGER GLOBALS
//
// -----------------------------------------------------------------------------

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
