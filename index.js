/* @flow */

import HomeScreen from './src/components/HomeScreen.react';
import Icons from './src/design/icons';

import { Navigation } from 'react-native-navigation';

const SettingsListButton = {
  disableIconTint: true,
  icon: Icons.List,
};

const ConverseButton = {
  disableIconTint: true,
  icon: Icons.InfindiLogoNavBar,
};

Navigation.registerComponent('Home', () => HomeScreen);

Navigation.startTabBasedApp({
  tabs: [
    {
      label: 'One',
      navigatorButtons: {
        leftButtons: [SettingsListButton],
        rightButtons: [ConverseButton],
      },
      navigatorStyle: {},
      screen: 'Home',
    },
  ],
});
