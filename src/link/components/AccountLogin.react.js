/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import TextDesign from '../../design/text';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import { StyleSheet, View } from 'react-native';

import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';

export type Props = {
  isEditable: bool,
  onChangeLoginForm: (loginForm: YodleeLoginForm) => any,
  onPressForgotPassword: (url: string) => any,
  loginForm: YodleeLoginForm,
};

export default class AccountLogin extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.content}>
          <YodleeLoginFormComponent
            isEditable={this.props.isEditable}
            loginForm={this.props.loginForm}
            onChangeLoginForm={this.props.onChangeLoginForm}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    marginTop: 32,
  },

  loginEntryRow: {
    borderBottomWidth: 1,
    borderColor: Colors.BORDER,
    fontFamily: TextDesign.thickFont,
    fontSize: TextDesign.largeFontSize,
    marginBottom: 24,
    marginHorizontal: 24,
    paddingBottom: 4,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
