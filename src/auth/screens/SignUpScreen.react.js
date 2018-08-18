/* @flow */

import BannerManager from '../../banner/BannerManager.react';
import Content from '../../shared/components/Content.react';
import FooterWithButton from '../../shared/components/FooterWithButtons.react';
import React, { Component } from 'react';
import Screen from '../../shared/components/Screen.react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import { GetTheme } from '../../design/components/Theme.react';
import {
  removeSignUpValidationError,
  showSignUpValidationError,
  signUp,
} from '../Actions';
import { StyleSheet, TextInput, View } from 'react-native';

import type { ElementRef } from 'react';
import type { ReduxProps, ReduxState } from '../../store';
import type { SignUpForm } from 'common/lib/models/Auth';
import type { Theme } from '../../design/themes';

type TextInputRef = ElementRef<typeof TextInput>;

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComponentProps = {};

type ComputedProps = {
  isWaitingForSignUp: boolean,
};

type State = {
  confirmPassword: string,
  signUpForm: SignUpForm,
};

type Validation = { isValid: true } | { isValid: false, reason: string };

class SignUpScreen extends Component<Props, State> {
  state: State = {
    confirmPassword: '',
    signUpForm: {
      email: '',
      firstName: '',
      isTestUser: false,
      lastName: '',
      password: '',
    },
  };

  _confirmPasswordInputRef: TextInputRef | null = null;
  _emailInputRef: TextInputRef | null = null;
  _firstNameInputRef: TextInputRef | null = null;
  _lastNameInputRef: TextInputRef | null = null;
  _passwordInputRef: TextInputRef | null = null;

  componentWillUnmount(): void {
    this.props.dispatch(removeSignUpValidationError());
  }

  render() {
    const { isWaitingForSignUp } = this.props;
    const { signUpForm } = this.state;
    return (
      <GetTheme>
        {(theme: Theme) => (
          <Screen avoidKeyboard={true} avoidNavBar={true}>
            <Content>
              <BannerManager
                channels={['SIGN_UP']}
                managerKey="SIGN_UP_SCREEN"
              />
              {this._renderForm(theme)}
            </Content>
            <FooterWithButton
              buttonLayout={
                isWaitingForSignUp
                  ? {
                      type: 'LOADING',
                    }
                  : {
                      centerButtonText: signUpForm.isTestUser
                        ? 'CREATE TEST ACCOUNT'
                        : 'CREATE ACCOUNT',
                      isCenterButtonDisabled: false,
                      type: 'CENTER',
                    }
              }
              onLongPress={this._onLongPressFooterButton}
              onPress={this._onPressFooterButton}
            />
          </Screen>
        )}
      </GetTheme>
    );
  }

  _renderForm(theme: Theme) {
    return (
      <View style={styles.form}>
        <TextInput
          autoCapitalize="words"
          autoFocus={true}
          editable={!this.props.isWaitingForSignUp}
          onChangeText={this._onChangeFirstName}
          onSubmitEditing={this._onSubmitFirstName}
          placeholder="First Name"
          ref={this._setFirstNameInputRef}
          returnKeyType="next"
          style={[
            styles.textInput,
            { borderColor: theme.color.borderNormal },
            theme.getTextStyleHeader3(),
          ]}
        />
        <TextInput
          autoCapitalize="words"
          editable={!this.props.isWaitingForSignUp}
          placeholder="Last Name"
          onChangeText={this._onChangeLastName}
          onSubmitEditing={this._onSubmitLastName}
          ref={this._setLastNameInputRef}
          returnKeyType="next"
          style={[
            styles.textInput,
            { borderColor: theme.color.borderNormal },
            theme.getTextStyleHeader3(),
          ]}
        />
        <TextInput
          autoCapitalize="none"
          editable={!this.props.isWaitingForSignUp}
          keyboardType="email-address"
          onChangeText={this._onChangeEmail}
          onSubmitEditing={this._onSubmitEmail}
          placeholder="Email"
          ref={this._setEmailInputRef}
          returnKeyType="next"
          style={[
            styles.textInput,
            { borderColor: theme.color.borderNormal },
            theme.getTextStyleHeader3(),
          ]}
        />
        <TextInput
          autoCapitalize="none"
          editable={!this.props.isWaitingForSignUp}
          onChangeText={this._onChangePassword}
          onSubmitEditing={this._onSubmitPassword}
          placeholder="Password"
          ref={this._setPasswordInputRef}
          returnKeyType="next"
          secureTextEntry={true}
          style={[
            styles.textInput,
            { borderColor: theme.color.borderNormal },
            theme.getTextStyleHeader3(),
          ]}
        />
        <TextInput
          autoCapitalize="none"
          editable={!this.props.isWaitingForSignUp}
          onChangeText={this._onChangeConfirmPassword}
          onSubmitEditing={this._onSubmitConfirmPassword}
          placeholder="Confirm Password"
          ref={this._setConfirmPasswordInputRef}
          returnKeyType="done"
          secureTextEntry={true}
          style={[
            styles.textInput,
            { borderColor: theme.color.borderNormal },
            theme.getTextStyleHeader3(),
          ]}
        />
      </View>
    );
  }

  _onLongPressFooterButton = (button: *): void => {
    invariant(
      button === 'CENTER',
      'Expecting pressed button to be in the center',
    );

    const { signUpForm } = this.state;
    this.setState({
      signUpForm: { ...signUpForm, isTestUser: !signUpForm.isTestUser },
    });
  };

  _onPressFooterButton = (button: *): void => {
    invariant(
      button === 'CENTER',
      'Expecting pressed button to be in the center',
    );

    const validation = this._calculateFormValidation();
    if (!validation.isValid) {
      this.props.dispatch(showSignUpValidationError(validation.reason));
    } else {
      this.props.dispatch(removeSignUpValidationError());
      this.props.dispatch(signUp(this.state.signUpForm));
    }
  };

  _onChangeFirstName = (firstName: string): void => {
    this.setState({ signUpForm: { ...this.state.signUpForm, firstName } });
  };

  _onChangeLastName = (lastName: string): void => {
    this.setState({ signUpForm: { ...this.state.signUpForm, lastName } });
  };

  _onChangeEmail = (email: string): void => {
    this.setState({ signUpForm: { ...this.state.signUpForm, email } });
  };

  _onChangePassword = (password: string): void => {
    this.setState({ signUpForm: { ...this.state.signUpForm, password } });
  };

  _onChangeConfirmPassword = (confirmPassword: string): void => {
    this.setState({ confirmPassword });
  };

  _onSubmitFirstName = (): void => {
    this._lastNameInputRef && this._lastNameInputRef.focus();
  };

  _onSubmitLastName = (): void => {
    this._emailInputRef && this._emailInputRef.focus();
  };

  _onSubmitEmail = (): void => {
    this._passwordInputRef && this._passwordInputRef.focus();
  };

  _onSubmitPassword = (): void => {
    this._confirmPasswordInputRef && this._confirmPasswordInputRef.focus();
  };

  _onSubmitConfirmPassword = (): void => {};

  _setFirstNameInputRef = (ref: TextInputRef): void => {
    this._firstNameInputRef = ref;
  };

  _setLastNameInputRef = (ref: TextInputRef): void => {
    this._lastNameInputRef = ref;
  };

  _setEmailInputRef = (ref: TextInputRef): void => {
    this._emailInputRef = ref;
  };

  _setPasswordInputRef = (ref: TextInputRef): void => {
    this._passwordInputRef = ref;
  };

  _setConfirmPasswordInputRef = (ref: TextInputRef): void => {
    this._confirmPasswordInputRef = ref;
  };

  _calculateFormValidation(): Validation {
    const { confirmPassword, signUpForm } = this.state;
    if (signUpForm.firstName.length < 2) {
      return {
        isValid: false,
        reason: 'First Name must be at least 2 characters',
      };
    }

    if (signUpForm.lastName.length < 2) {
      return {
        isValid: false,
        reason: 'Last Name must be at least 2 characters',
      };
    }

    if (!/[^@]@[^@]/.test(signUpForm.email)) {
      return {
        isValid: false,
        reason: 'Invalid email address',
      };
    }

    if (signUpForm.password.length < 6) {
      return {
        isValid: false,
        reason: 'Password must be at least 6 characters',
      };
    }

    if (!/[0-9]/.test(signUpForm.password)) {
      return {
        isValid: false,
        reason: 'Password must contain a number',
      };
    }

    if (!/[A-Z]/.test(signUpForm.password)) {
      return {
        isValid: false,
        reason: 'Password must contain an upper case letter',
      };
    }

    if (confirmPassword !== signUpForm.password) {
      return {
        isValid: false,
        reason: 'Password does not match password confirmation',
      };
    }

    return { isValid: true };
  }
}

function mapReduxStateToProps(state: ReduxState): ComputedProps {
  return {
    isWaitingForSignUp: state.auth.status.type === 'SIGN_UP_INITIALIZE',
  };
}

export default connect(mapReduxStateToProps)(SignUpScreen);

const styles = StyleSheet.create({
  form: {
    marginHorizontal: 40,
    marginVertical: 24,
  },

  root: {
    flex: 1,
  },

  textInput: {
    borderBottomWidth: 1,
    height: 24,
    marginBottom: 24,
    paddingBottom: 4,
  },
});
