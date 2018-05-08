/* @flow */

import Icons from '../../design/icons';
import LoginScreen from '../../auth/components/LoginScreen.react';
import React, { Component } from 'react';
import SignUpScreen from '../../auth/components/SignUpScreen.react';

import { connect } from 'react-redux';
import { NavigatorIOS } from 'react-native';
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
        onLeftButtonPress: () => {
          !this.props.shouldStayOnSignUpScreen &&
          this._shouldAllowBackButton &&
            this.props.dispatch(setShouldShowSignUpScreen(false));
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
    shouldStayOnSignUpScreen: state.auth.type === 'SIGN_UP_INITIALIZE',
  };
}

export default connect(mapReduxStateToProps)(AuthNavigator);

function shouldShowSignUpScreen(props: Props): boolean {
  return Boolean(
    props.routeNode.next && props.routeNode.next.name === 'SIGN_UP',
  );
}
