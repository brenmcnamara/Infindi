/* @flow */

import * as React from 'react';
import LoginScreen from '../auth/screens/LoginScreen.react';
import SignUpScreen from '../auth/screens/SignUpScreen.react';
import StackNavigator from './StackNavigator.react';

import invariant from 'invariant';

import { showSignUpScreen } from '../auth/Actions';

import type { Action, ReduxState } from '../store';

export type AuthRenderProps = {
  isShowingSignUpScreen: boolean,
};
export type Props = ComponentProps & ComputedProps;

type ComponentProps = {};
type ComputedProps = {};

export default class AuthNavigator extends React.Component<Props> {
  render() {
    return (
      <StackNavigator
        calculateBackAction={this._calculateBackAction}
        calculateStackForState={this._calculateStackForState}
        initialScreen="Login"
        screens={Screens}
      />
    );
  }

  _calculateStackForState = (state: ReduxState): Array<string> => {
    return state.auth.isShowingSignUpScreen ? ['Login', 'SignUp'] : ['Login'];
  };

  _calculateBackAction = (
    backScreen: string,
    currentScreen: string,
  ): Action => {
    const change = `${currentScreen} -> ${backScreen}`;
    switch (change) {
      case 'SignUp -> Login': {
        return showSignUpScreen(false);
      }

      default:
        return invariant(false, 'Unhandled back transition %s', change);
    }
  };
}

const Screens = [
  {
    component: LoginScreen,
    screen: 'Login',
  },
  {
    component: SignUpScreen,
    screen: 'SignUp',
  },
];
