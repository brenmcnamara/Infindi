/* @flow */

import Content from '../../shared/components/Content.react';
import Footer from '../../shared/components/Footer.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import Screen from '../../shared/components/Screen.react';
import TextButton from '../../shared/components/TextButton.react';

import invariant from 'invariant';

import {
  ActivityIndicator,
  Animated,
  Easing,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';
import { GetTheme } from '../../design/components/Theme.react';
import { login, showSignUpScreen } from '../Actions';

import type { ElementRef } from 'react';
import type { LoginCredentials } from 'common/lib/models/Auth';
import type { ReduxProps, ReduxState } from '../../store';
import type { Theme } from '../../design/themes';

export type Props = ReduxProps & ComponentProps & ComputedProps;
type LoginType = 'NORMAL' | 'ERROR' | 'LOADING';

type ComponentProps = {};
type ComputedProps = {
  loginType: LoginType,
};
type State = {
  credentials: LoginCredentials,
  isShowingLoginError: boolean,
};

type TextInputRef = ElementRef<typeof TextInput>;

const AMPLITUDE = 7;
const PRECISION = 15;
const NUMBER_OF_SHAKES = 3;
const WIGGLE_DURATION_MILLIS = 350;

class LoginScreen extends Component<Props, State> {
  state: State = {
    credentials: {
      email: '',
      password: '',
    },
    isShowingLoginError: false,
  };

  _errorFadeTransition = new Animated.Value(0);
  _errorWiggleAnimation = new Animated.Value(0);
  _isAnimating: boolean = false;
  _isWaitingForLoginResult: boolean = false;
  _passwordInputRef: TextInputRef | null;

  componentDidMount(): void {
    if (this.props.loginType === 'ERROR') {
      this._errorFadeTransition.setValue(1);
    }
  }

  componentWillUnmount(): void {
    this._isAnimating = false;
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (this._isWaitingForLoginResult && nextProps.loginType === 'ERROR') {
      this._isWaitingForLoginResult = false;
      this._isAnimating = true;
      if (this.state.isShowingLoginError) {
        this._errorWiggleAnimation.setValue(1);
        this._isAnimating = true;
        Animated.timing(this._errorWiggleAnimation, {
          duration: WIGGLE_DURATION_MILLIS,
          toValue: 0,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(() => {
          this._isAnimating = false;
        });
      } else {
        Animated.timing(this._errorFadeTransition, {
          duration: 400,
          easing: Easing.out(Easing.cubic),
          toValue: 1,
          useNativeDriver: true,
        }).start(() => {
          if (this._isAnimating) {
            this.setState({ isShowingLoginError: true });
          }
          this._isAnimating = false;
        });
      }
    }
  }

  render() {
    const animatedErrorStyles = {
      opacity: this._errorFadeTransition,
      transform: [
        {
          translateX: this._getWiggleAnimatedValue(),
        },
        {
          translateY: this._errorFadeTransition.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <GetTheme>
        {(theme: Theme) => (
          <Screen avoidKeyboard={true} avoidNavBar={true}>
            <Content>
              <View style={styles.logoContainer}>
                <Image
                  source={Icons.InfindiLogoSplash}
                  style={[styles.logo, { width: 50, height: 24 }]}
                />
              </View>
              <View style={styles.loginForm}>
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus={true}
                  editable={this.props.loginType !== 'LOADING'}
                  keyboardType="email-address"
                  onChangeText={this._onChangeEmail}
                  onSubmitEditing={this._onSubmitEmail}
                  placeholder="Email"
                  returnKeyType="next"
                  style={[
                    styles.formInput,
                    { borderColor: theme.color.borderNormal },
                    theme.getTextStyleHeader3(),
                  ]}
                />
                <TextInput
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={this.props.loginType !== 'LOADING'}
                  onChangeText={this._onChangePassword}
                  onSubmitEditing={this._onSubmitPassword}
                  placeholder="Password"
                  ref={this._setPasswordRef}
                  returnKeyType="done"
                  secureTextEntry={true}
                  style={[
                    styles.formInput,
                    { borderColor: theme.color.borderNormal },
                    theme.getTextStyleHeader3(),
                  ]}
                />
              </View>
              <View style={styles.createAccountContainer}>
                <TextButton
                  onPress={this._onPressCreateAccount}
                  size="MEDIUM"
                  text="Create a New Account"
                  type="SPECIAL"
                />
              </View>
              <Animated.View style={[styles.loginError, animatedErrorStyles]}>
                <Text style={[theme.getTextStyleAlert(), styles.marginBottom8]}>
                  Login Failed.
                </Text>
                <Text style={theme.getTextStyleAlert()}>
                  Please check your credentials.
                </Text>
              </Animated.View>
            </Content>
            <Footer style={styles.footer}>
              {this.props.loginType === 'LOADING' ? (
                <ActivityIndicator size="small" />
              ) : (
                <TextButton
                  layoutType="FILL_PARENT"
                  onPress={this._onPressLogin}
                  size="LARGE"
                  text="LOGIN"
                  type="PRIMARY"
                />
              )}
            </Footer>
          </Screen>
        )}
      </GetTheme>
    );
  }

  _onChangeEmail = (email: string): void => {
    const credentials = { ...this.state.credentials, email };
    // $FlowFixMe - Need to find solution to exact type spread.
    this.setState({ credentials });
  };

  _onChangePassword = (password: string): void => {
    const credentials = { ...this.state.credentials, password };
    // $FlowFixMe - Need to find solution to exact type spread.
    this.setState({ credentials });
  };

  _onSubmitEmail = (): void => {
    this._passwordInputRef && this._passwordInputRef.focus();
  };

  _onSubmitPassword = (): void => {
    this.props.dispatch(login(this.state.credentials));
  };

  _onPressCreateAccount = (): void => {
    this.props.dispatch(showSignUpScreen(true));
  };

  _onPressLogin = (): void => {
    this._isWaitingForLoginResult = true;
    this.props.dispatch(login(this.state.credentials));
  };

  _setPasswordRef = (ref: TextInputRef | null) => {
    this._passwordInputRef = ref;
  };

  _getWiggleAnimatedValue() {
    // Want the interpolation to follow a wave defined by a function.
    const inputRange = [];
    const outputRange = [];
    for (let i = 0; i < PRECISION; ++i) {
      const x = i / PRECISION;
      inputRange.push(x);
      outputRange.push(wiggleFunction(x));
    }
    return this._errorWiggleAnimation.interpolate({
      inputRange,
      outputRange,
    });
  }
}

function wiggleFunction(x: number): number {
  return AMPLITUDE * Math.sin(x * Math.PI * 2 * NUMBER_OF_SHAKES);
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {
    loginType: calculateLoginType(state),
  };
}

export default connect(mapReduxStateToProps)(LoginScreen);

function calculateLoginType(state: ReduxState): LoginType {
  const { auth } = state;
  switch (auth.status.type) {
    case 'LOGGED_OUT':
    case 'LOGOUT_FAILURE':
    case 'LOGOUT_INITIALIZE':
    case 'SIGN_UP_FAILURE':
      return 'NORMAL';

    case 'LOGGED_IN':
    case 'LOGIN_INITIALIZE':
    case 'SIGN_UP_INITIALIZE':
      return 'LOADING';

    case 'LOGIN_FAILURE':
      return 'ERROR';

    default:
      return invariant(
        false,
        'LoginScreen does not handle auth status %s',
        auth.status.type,
      );
  }
}

const styles = StyleSheet.create({
  createAccountContainer: {
    alignItems: 'center',
    marginTop: 16,
  },

  formInput: {
    borderBottomWidth: 1,
    height: 24,
    marginBottom: 24,
    paddingBottom: 4,
  },

  footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  loginError: {
    alignItems: 'center',
    marginTop: 24,
  },

  loginForm: {
    paddingHorizontal: 40,
  },

  logo: {},

  logoContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },

  marginBottom8: {
    marginBottom: 8,
  },
});
