/* @flow */

import AccountsScreen from './AccountsScreen.react';
import HomeScreen from './HomeScreen.react';
import Icons from '../design/icons';
import Navigator from './shared/Navigator.react';
import React, { Component } from 'react';
import Store from '../store';

import { Provider } from 'react-redux';
import { TabBarIOS } from 'react-native';

export default class AppContainer extends Component<{}> {
  render() {
    return (
      <Provider store={Store}>
        <TabBarIOS>
          <TabBarIOS.Item
            icon={Icons.Home}
            onPress={() => console.log('pressed tab bar!')}
            selected={true}
            title="Home"
          >
            <Navigator payload={{ component: HomeScreen }} />
          </TabBarIOS.Item>
          <TabBarIOS.Item
            icon={Icons.Bank}
            onPress={() => console.log('on press bank icon')}
            selected={false}
            title="Accounts"
          >
            <Navigator payload={{ component: AccountsScreen }} />
          </TabBarIOS.Item>
        </TabBarIOS>
      </Provider>
    );
  }
}
