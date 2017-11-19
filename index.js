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
