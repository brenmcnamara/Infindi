/* @flow */

import Icons from '../../design/icons';
import LoginScreen from '../../auth/screens/LoginScreen.react';
import React, { Component } from 'react';
import SignUpScreen from '../../auth/screens/SignUpScreen.react';

import { connect } from 'react-redux';
import { NavigatorIOS } from 'react-native';
import { removeSignUpValidationError } from '../../auth/actions';
import { setShouldShowSignUpScreen } from '../../actions/router';

import type { ReduxProps, ReduxState } from '../../store';
import type { RouteNode } from '../../common/route-utils';
import type { Theme } from '../../design/themes';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {
  routeNode: RouteNode,
  theme: Theme,
};

type ComputedProps = {
  shouldStayOnSignUpScreen: boolean,
};

class AuthNavigator extends Component<Props> {
  _shouldAllowBackButton: boolean;

  componentDidMount(): void {
    this._shouldAllowBackButton = shouldShowSignUpScreen(this.props);
  }

  componentWillReceiveProps(nextProps: Props): void {
    const isShowingSignUpScreen = shouldShowSignUpScreen(this.props);
    const willShowSignUpScreen = shouldShowSignUpScreen(nextProps);
    if (isShowingSignUpScreen && !willShowSignUpScreen) {
      this._shouldAllowBackButton = false;
      this.refs.nav.pop();
    } else if (!isShowingSignUpScreen && willShowSignUpScreen) {
      this._shouldAllowBackButton = true;
      this.refs.nav.push({
        barTintColor: nextProps.theme.color.backgroundMain,
        component: SignUpScreen,
        leftButtonIcon: Icons.LeftArrow,
        // TODO: Inversion of control, put this function in SignUpScreen.
        onLeftButtonPress: () => {
          if (
            this.props.shouldStayOnSignUpScreen ||
            !this._shouldAllowBackButton
          ) {
            return;
          }
          this.props.dispatch(setShouldShowSignUpScreen(false));
          this.props.dispatch(removeSignUpValidationError());
        },
        shadowHidden: true,
        tintColor: nextProps.theme.color.buttonNavBar,
        title: '',
      });
    }
  }

  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          barTintColor: this.props.theme.color.backgroundMain,
          component: LoginScreen,
          shadowHidden: true,
          tintColor: this.props.theme.color.buttonNavBar,
          title: '',
        }}
        ref="nav"
        style={{ flex: 1 }}
      />
    );
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {
    shouldStayOnSignUpScreen: state.auth.status.type === 'SIGN_UP_INITIALIZE',
  };
}

export default connect(mapReduxStateToProps)(AuthNavigator);

function shouldShowSignUpScreen(props: Props): boolean {
  return Boolean(
    props.routeNode.next && props.routeNode.next.name === 'SIGN_UP',
  );
}
