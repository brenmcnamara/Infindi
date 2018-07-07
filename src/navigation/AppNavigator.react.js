/* @flow */

import * as React from 'react';
import AuthNavigator from './AuthNavigator.react';
import LoadingScreen from '../core/LoadingScreen.react';
import MainNavigator from './MainNavigator.react';
import SwitchNavigator from './SwitchNavigator.react';

import invariant from 'invariant';

import type { ReduxState } from '../store';

export type Props = ComponentProps & ComputedProps;
export type AppRoute = 'AUTH' | 'LOADING' | 'MAIN';

type ComponentProps = {};
type ComputedProps = {};

export default class AppNavigator extends React.Component<Props> {
  render() {
    return (
      <SwitchNavigator
        calculateScreenForState={this._calculateScreenForState}
        screens={Screens}
      />
    );
  }

  _calculateScreenForState = (state: ReduxState): string => {
    const { auth } = state;
    switch (auth.status.type) {
      case 'LOGIN_INITIALIZE':
      case 'LOGIN_FAILURE':
      case 'LOGOUT_INITIALIZE':
      case 'LOGOUT_FAILURE':
      case 'LOGGED_OUT':
      case 'SIGN_UP_FAILURE':
      case 'SIGN_UP_INITIALIZE': {
        // The user can only see the login page if they have internet.
        return 'Auth';
      }

      case 'LOGGED_IN': {
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
    component: LoadingScreen,
    screen: 'Loading',
  },
  {
    component: MainNavigator,
    screen: 'Main',
  },
];
