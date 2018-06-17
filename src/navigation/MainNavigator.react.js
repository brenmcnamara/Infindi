/* @flow */

import * as React from 'react';
import AccountsScreen from '../components/AccountsScreen.react';
import StackNavigator from './StackNavigator.react';

import type { ReduxState } from '../store';

export type Props = {};

export default class MainNavigator extends React.Component<Props> {
  render() {
    return (
      <StackNavigator
        calculateStackForState={this._calculateStackForState}
        isBarShadowShowing={true}
        screens={Screens}
      />
    );
  }

  _calculateStackForState = (state: ReduxState): Array<string> => {
    return ['Accounts'];
  };
}

const Screens = [
  {
    component: AccountsScreen,
    screen: 'Accounts',
  },
];
