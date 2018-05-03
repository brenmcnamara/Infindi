/* @flow */

import Content from '../../components/shared/Content.react';
import Footer from '../../components/shared/Footer.react';
import Icons from '../../design/icons';
import React, { Component } from 'react';
import Screen from '../../components/shared/Screen.react';
import TextButton from '../../components/shared/TextButton.react';

import { GetTheme } from '../../design/components/Theme.react';
import { setShouldShowSignUpScreen } from '../../actions/router';

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
import { login } from '../../auth/actions';

import type { ElementRef } from 'react';
import type { LoginCredentials } from 'common/lib/models/Auth';
import type { ReduxProps } from '../../store';
import type { State as StoreState } from '../../reducers/root';
import type { Theme } from '../../design/themes';

export type Props = ReduxProps & {
  loginType: 'NORMAL' | 'ERROR' | 'LOADING',
};

type State = {
  credentials: LoginCredentials,
  isShowingLoginError: boolean,
};

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
  _passwordInputRef: ElementRef<typeof TextInput>;

  componentDidMount(): void {
    if (this.props.loginType === 'ERROR') {
      this._errorFadeTransition.setValue(1);
    }
  }

  componentWillUnmount(): void {
    this._isAnimating = false;
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.loginType === 'ERROR') {
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
    this._passwordInputRef.focus();
  };

  _onSubmitPassword = (): void => {
    this.props.dispatch(login(this.state.credentials));
  };

  _onPressCreateAccount = (): void => {
    this.props.dispatch(setShouldShowSignUpScreen(true));
  };

  _onPressLogin = (): void => {
    this.props.dispatch(login(this.state.credentials));
  };

  _setPasswordRef = (ref: ElementRef<typeof TextInput>) => {
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

const PRECISION = 15;
const AMPLITUDE = 7;
const NUMBER_OF_SHAKES = 3;
const WIGGLE_DURATION_MILLIS = 350;

function wiggleFunction(x: number): number {
  return AMPLITUDE * Math.sin(x * Math.PI * 2 * NUMBER_OF_SHAKES);
}

function mapReduxStateToProps(state: StoreState) {
  const { auth } = state;
  let loginType;
  switch (auth.type) {
    case 'LOGGED_OUT':
    case 'LOGOUT_FAILURE':
    case 'LOGOUT_INITIALIZE':
      loginType = 'NORMAL';
      break;

    case 'LOGGED_IN':
    case 'LOGIN_INITIALIZE':
      loginType = 'LOADING';
      break;

    case 'LOGIN_FAILURE':
      loginType = 'ERROR';
      break;

    default:
      invariant(false, 'LoginScreen does not handle auth status %s', auth.type);
  }
  return { loginType };
}

export default connect(mapReduxStateToProps)(LoginScreen);

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
  },

  loginForm: {
    paddingHorizontal: 40,
  },

  logo: {},

  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },

  marginBottom8: {
    marginBottom: 8,
  },
});
