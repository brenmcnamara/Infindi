/* @flow */

import * as React from 'react';
import AccountDetailsScreen from '../components/AccountDetailsScreen.react';
import AccountsScreen from '../components/AccountsScreen.react';
import Icons from '../design/icons';
import ProviderLoginScreen from '../link/screens/ProviderLoginScreen.react';
import ProviderSearchScreen from '../link/screens/ProviderSearchScreen.react';
import StackNavigator from './StackNavigator.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { exitAccountDetails } from '../actions/router';
import { exitAccountVerification, requestProviderSearch } from '../link/action';
import { requestLeftPane, requestRightPane } from '../actions/modal';

import type { Action, ReduxProps, ReduxState } from '../store';

export type Props = ReduxProps & {};

class MainNavigator extends React.Component<Props> {
  render() {
    return (
      <StackNavigator
        calculateBackAction={this._calculateBackAction}
        calculateStackForState={this._calculateStackForState}
        getLeftNavButton={this._getLeftNavButton}
        getRightNavButton={this._getRightNavButton}
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

      case 'ProviderLogin -> ProviderSearch':
        return requestProviderSearch();

      default:
        return invariant(false, `Unrecognized screen change: ${change}`);
    }
  };

  _calculateStackForState = (
    reduxState: ReduxState,
    prevStack: Array<string>,
  ): Array<string> => {
    if (reduxState.routeState.accountDetailsID) {
      return ['Accounts', 'AccountDetails'];
    }

    const accountVerificationPage = reduxState.accountVerification.page;
    if (accountVerificationPage) {
      if (accountVerificationPage.type === 'SEARCH') {
        return ['Accounts', 'ProviderSearch'];
      }
      return prevStack[prevStack.length - 1] === 'ProviderLogin'
        ? prevStack
        : prevStack.concat(['ProviderLogin']);
    }

    return ['Accounts'];
  };

  _getLeftNavButton = (currentScreen: string) => {
    if (currentScreen === 'Accounts') {
      return {
        icon: Icons.List,
        onPress: this._onPressLeftNavButton,
      };
    }
    return null;
  };

  _getRightNavButton = (currentScreen: string) => {
    if (currentScreen === 'Accounts') {
      return {
        icon: Icons.InfindiLogoNavBar,
        onPress: this._onPressRightNavButton,
      };
    }
    return null;
  };

  _onPressLeftNavButton = (): void => {
    this.props.dispatch(requestLeftPane());
  };

  _onPressRightNavButton = (): void => {
    this.props.dispatch(requestRightPane());
  };
}

export default connect()(MainNavigator);

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
