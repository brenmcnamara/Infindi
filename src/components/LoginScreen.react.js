/* @flow */

import Colors from '../design/colors';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import TextDesign from '../design/text';
import TextButton from './shared/TextButton.react';

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
import { login } from '../actions/authentication';

import { type LoginCredentials } from '../types/db';
import { type ReduxProps } from '../types/redux';

export type Props = ReduxProps & {
  type: 'NORMAL' | 'ERROR' | 'LOADING',
};

type State = {
  credentials: LoginCredentials,
  errorViewProgress: Animated.Value,
};

class LoginScreen extends Component<Props, State> {
  state: State = {
    credentials: {
      email: '',
      password: '',
    },
    errorViewProgress: new Animated.Value(0),
  };

  componentDidMount(): void {
    if (this.props.type === 'ERROR') {
      this.state.errorViewProgress.setValue(1);
    }
  }

  componentWillReceiveProps(nextProps: Props): void {
    if (nextProps.type === 'ERROR') {
      Animated.timing(this.state.errorViewProgress, {
        duration: 400,
        easing: Easing.out(Easing.cubic),
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }

  render() {
    const animatedErrorStyles = {
      opacity: this.state.errorViewProgress,
      transform: [
        {
          translateY: this.state.errorViewProgress.interpolate({
            inputRange: [0, 1],
            outputRange: [20, 0],
          }),
        },
      ],
    };

    return (
      <Screen avoidKeyboard={true}>
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
              editable={this.props.type !== 'LOADING'}
              keyboardType="email-address"
              onChangeText={this._onChangeEmail}
              onSubmitEditing={this._onSubmitEmail}
              placeholder="Email"
              returnKeyType="next"
              style={[styles.formInput, TextDesign.header3]}
            />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              editable={this.props.type !== 'LOADING'}
              onChangeText={this._onChangePassword}
              onEndEditing={this._onSubmitPassword}
              placeholder="Password"
              ref="passwordInputRef"
              returnKeyType="done"
              secureTextEntry={true}
              style={[styles.formInput, TextDesign.header3]}
            />
          </View>
          <Animated.View style={[styles.loginError, animatedErrorStyles]}>
            <Text style={[TextDesign.error, styles.marginBottom8]}>
              Login Failed.
            </Text>
            <Text style={TextDesign.error}>Please check your credentials.</Text>
          </Animated.View>
        </Content>
        <Footer style={styles.footer}>
          {this.props.type === 'LOADING' ? (
            <ActivityIndicator size="small" />
          ) : (
            <TextButton
              onPress={this._onPressLogin}
              size="LARGE"
              text="LOGIN"
              type="PRIMARY"
            />
          )}
        </Footer>
      </Screen>
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
    this.refs.passwordInputRef.focus();
  };

  _onSubmitPassword = (): void => {
    this.props.dispatch(login(this.state.credentials));
  };

  _onPressLogin = (): void => {
    this.props.dispatch(login(this.state.credentials));
  };
}

export default connect()(LoginScreen);

const styles = StyleSheet.create({
  formInput: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
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

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
