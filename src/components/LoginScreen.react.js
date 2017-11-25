/* @flow */

import Colors from '../design/colors';
import Content from './shared/Content.react';
import Footer from './shared/Footer.react';
import Icons from '../design/icons';
import React, { Component } from 'react';
import Screen from './shared/Screen.react';
import Text from '../design/text';
import TextButton from './shared/TextButton.react';

import { Image, StyleSheet, TextInput, View } from 'react-native';

export type Props = {
  transitionInLogin: bool,
};

export default class LoginScreen extends Component<Props> {
  render() {
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
              autoFocus={true}
              keyboardType="email-address"
              onEndEditing={this._onSubmitEmail}
              placeholder="Email"
              returnKeyType="next"
              style={[styles.formInput, Text.header3]}
            />
            <TextInput
              onEndEditing={this._onSubmitPassword}
              placeholder="Password"
              ref="passwordInputRef"
              returnKeyType="done"
              secureTextEntry={true}
              style={[styles.formInput, Text.header3]}
            />
          </View>
        </Content>
        <Footer style={styles.footer}>
          <TextButton
            onPress={this._onPressLogin}
            size="LARGE"
            text="LOGIN"
            type="PRIMARY"
          />
        </Footer>
      </Screen>
    );
  }

  _onSubmitEmail = (): void => {
    this.refs.passwordInputRef.focus();
  };

  _onSubmitPassword = (): void => {};

  _onPressLogin = (): void => {};
}

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

  loginForm: {
    paddingHorizontal: 40,
  },

  logo: {},

  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 24,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
