/* @flow */

import Colors from '../../design/colors';
import React, { Component } from 'react';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import invariant from 'invariant';

import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import { getAccountLinkForProviderID } from '../../common/state-utils';
import { updateLoginForm } from '../action';

import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComponentProps = {
  isEditable: bool,
  providerID: ID,
};

type ComputedProps = {
  isLoadingLoginForm: bool,
  loginForm: YodleeLoginForm,
};

class AccountLogin extends Component<Props> {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.content}>
          {this.props.isLoadingLoginForm ? (
            <View style={styles.activityIndicatorContainer}>
              <ActivityIndicator size="small" />
            </View>
          ) : (
            <YodleeLoginFormComponent
              isEditable={this.props.isEditable}
              loginForm={this.props.loginForm}
              onChangeLoginForm={this._onChangeLoginForm}
            />
          )}
        </View>
      </View>
    );
  }

  _onPressForgotPassword = (url: string): void => {
    // TODO: Open safari at the url.
    // https://facebook.github.io/react-native/docs/linking.html
  };

  _onChangeLoginForm = (loginForm: YodleeLoginForm): void => {
    this.props.dispatch(updateLoginForm(this.props.providerID, loginForm));
  };
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  const { providerID } = props;
  const loginForm = state.loginForms.loginFormContainer[providerID];
  const accountLink = getAccountLinkForProviderID(state, providerID);
  invariant(
    loginForm,
    'Expecting login form to exist for providerID',
    providerID,
  );
  return {
    isLoadingLoginForm: Boolean(
      accountLink && accountLink.status === 'MFA / WAITING_FOR_LOGIN_FORM',
    ),
    loginForm,
  };
}

export default connect(mapReduxStateToProps)(AccountLogin);

const styles = StyleSheet.create({
  activityIndicatorContainer: {
    marginTop: 32,
  },

  content: {
    flex: 1,
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    flex: 1,
  },
});
