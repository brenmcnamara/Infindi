/* @flow */

import * as React from 'react';
import AuthNavigator from './AuthNavigator.react';
import CheckInternetScreen from '../CheckInternetScreen.react';
import LoadingScreen from '../LoadingScreen.react';
import MainNavigator from './MainNavigator.react';
import ProviderFuzzySearchStateUtils from '../data-model/state-utils/ProviderFuzzySearch';
import SwitchNavigator from './SwitchNavigator.react';

import invariant from 'invariant';

import type { ReduxState } from '../store';

export type Props = ComponentProps;

type ComponentProps = {};

export default class AppNavigator extends React.Component<Props> {
  render() {
    return (
      <SwitchNavigator
        calculateScreenForState={this._calculateScreenForState}
        screens={Screens}
      />
    );
  }

  _calculateScreenForState = (reduxState: ReduxState): string => {
    const { auth } = reduxState;
    switch (auth.status.type) {
      case 'LOGIN_INITIALIZE':
      case 'LOGIN_FAILURE':
      case 'LOGOUT_INITIALIZE':
      case 'LOGOUT_FAILURE':
      case 'LOGGED_OUT':
      case 'SIGN_UP_FAILURE':
      case 'SIGN_UP_INITIALIZE': {
        return 'Auth';
      }

      case 'LOGGED_IN': {
        const providerInitialLoadState = ProviderFuzzySearchStateUtils.getInitialLoadState(
          reduxState,
        );
        if (
          providerInitialLoadState.type === 'UNINITIALIZED' ||
          providerInitialLoadState.type === 'LOADING'
        ) {
          return 'Loading';
        } else if (providerInitialLoadState.type === 'FAILURE') {
          return 'CheckInternet';
        }
        return 'Main';
      }

      case 'NOT_INITIALIZED': {
        return 'Loading';
      }

      default:
        invariant(false, 'Unrecognized auth status: %s', auth.status.type);
    }
  };
}

const Screens = [
  {
    component: AuthNavigator,
    screen: 'Auth',
  },
  {
    component: CheckInternetScreen,
    screen: 'CheckInternet',
  },
  {
    component: LoadingScreen,
    screen: 'Loading',
  },
  {
    component: MainNavigator,
    screen: 'Main',
  },
];
