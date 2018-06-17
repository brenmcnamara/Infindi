/* @flow */

import * as React from 'react';
import AuthNavigator from './AuthNavigator.react';
import DevErrorScreen from '../core/DevErrorScreen.react';
import LoadingScreen from '../core/LoadingScreen.react';
import SwitchNavigator from './SwitchNavigator.react';

import invariant from 'invariant';

import type { ReduxState } from '../store';

export type Props = ComponentProps & ComputedProps;
export type AppRoute = 'AUTH' | 'LOADING' | 'MAIN';

type ComponentProps = {};
type ComputedProps = {};

type AppRenderProps = {
  route: AppRoute,
};

export default class AppNavigator extends React.Component<Props> {
  render() {
    return (
      <SwitchNavigator mapReduxStateToProps={this._mapReduxStateToProps}>
        {(renderProps: AppRenderProps) => {
          switch (renderProps.route) {
            case 'AUTH':
              return <AuthNavigator />;

            case 'LOADING':
              return <LoadingScreen />;

            default:
              return (
                <DevErrorScreen
                  message={`Unrecognized app route ${renderProps.route}`}
                />
              );
          }
        }}
      </SwitchNavigator>
    );
  }

  _mapReduxStateToProps = (state: ReduxState): AppRenderProps => {
    return {
      route: calculateAppRoute(state),
    };
  };
}

function calculateAppRoute(state: ReduxState): AppRoute {
  const { auth, configState } = state;
  if (configState.envStatus === 'ENV_LOADING') {
    return 'LOADING';
  }

  switch (auth.status.type) {
    case 'LOGIN_INITIALIZE':
    case 'LOGIN_FAILURE':
    case 'LOGOUT_INITIALIZE':
    case 'LOGOUT_FAILURE':
    case 'LOGGED_OUT':
    case 'SIGN_UP_FAILURE':
    case 'SIGN_UP_INITIALIZE': {
      // The user can only see the login page if they have internet.
      return 'AUTH';
    }

    case 'LOGGED_IN': {
      return 'AUTH';
      const accountVerificationPage = state.accountVerification.page;
      if (!accountVerificationPage) {
        // return actionItems.selectedID ? 'RECOMMENDATION' : 'MAIN';
        return 'MAIN';
      }
      // return accountVerificationPage.type === 'SEARCH'
      //   ? 'PROVIDER_SEARCH'
      //   : 'PROVIDER_LOGIN';
      return 'MAIN';
    }

    case 'NOT_INITIALIZED': {
      return 'LOADING';
    }

    default:
      invariant(false, 'Unrecognized auth status: %s', auth.status.type);
  }
}
