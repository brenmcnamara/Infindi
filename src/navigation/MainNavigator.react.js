/* @flow */

import * as React from 'react';
import AccountDetailsScreen from '../components/AccountDetailsScreen.react';
import AccountsScreen from '../components/AccountsScreen.react';
import StackNavigator from './StackNavigator.react';

import invariant from 'invariant';

import { exitAccountDetails } from '../actions/router';

import type { Action, ReduxState } from '../store';

export type Props = {};

export default class MainNavigator extends React.Component<Props> {
  render() {
    return (
      <StackNavigator
        calculateBackAction={this._calculateBackAction}
        calculateStackForState={this._calculateStackForState}
        isBarShadowShowing={true}
        screens={Screens}
      />
    );
  }

  _calculateBackAction = (
    prevScreen: string,
    currentScreen: string,
  ): Action => {
    const change = `${currentScreen} -> ${prevScreen}`;
    switch (change) {
      case 'AccountDetails -> Accounts':
        return exitAccountDetails();

      default:
        return invariant(false, `Unrecognized screen change: ${change}`);
    }
  };

  _calculateStackForState = (state: ReduxState): Array<string> => {
    return state.routeState.accountDetailsID
      ? ['Accounts', 'AccountDetails']
      : ['Accounts'];
  };
}

const Screens = [
  {
    component: AccountDetailsScreen,
    screen: 'AccountDetails',
  },
  {
    component: AccountsScreen,
    screen: 'Accounts',
  },
];
