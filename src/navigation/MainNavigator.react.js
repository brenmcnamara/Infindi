/* @flow */

import * as React from 'react';
import AccountDetailsScreen from '../components/AccountDetailsScreen.react';
import AccountsScreen from '../components/AccountsScreen.react';
import ProviderLoginScreen from '../link/screens/ProviderLoginScreen.react';
import ProviderSearchScreen from '../link/screens/ProviderSearchScreen.react';
import StackNavigator from './StackNavigator.react';

import invariant from 'invariant';

import { exitAccountDetails } from '../actions/router';
import { exitAccountVerification } from '../link/action';

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

      case 'ProviderSearch -> Accounts':
      case 'ProviderLogin -> Accounts':
        return exitAccountVerification();
      default:
        return invariant(false, `Unrecognized screen change: ${change}`);
    }
  };

  _calculateStackForState = (state: ReduxState): Array<string> => {
    if (state.routeState.accountDetailsID) {
      return ['Accounts', 'AccountDetails'];
    }

    const accountVerificationPage = state.accountVerification.page;
    if (accountVerificationPage) {
      return accountVerificationPage.type === 'SEARCH'
        ? ['Accounts', 'ProviderSearch']
        : ['Accounts', 'ProviderLogin'];
    }

    return ['Accounts'];
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
  {
    component: ProviderLoginScreen,
    screen: 'ProviderLogin',
  },
  {
    component: ProviderSearchScreen,
    screen: 'ProviderSearch',
  },
];
