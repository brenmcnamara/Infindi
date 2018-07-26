/* @flow */

import AppContainer from './src/AppContainer.react';
import Common from 'common';
import Firebase from 'react-native-firebase';

import { AppRegistry } from 'react-native';

Common.initialize(Firebase);
AppRegistry.registerComponent('Infindi', () => AppContainer);
