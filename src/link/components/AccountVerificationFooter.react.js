/* @flow */

import FooterWithButtons from '../../components/shared/FooterWithButtons.react';
import React, { Component } from 'react';

import invariant from 'invariant';

import { connect } from 'react-redux';
import {
  dismissAccountVerification,
  submitYodleeLoginFormForProviderID,
} from '../action';

import type { AccountVerificationPage } from '../utils';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { ReduxProps } from '../../typesDEPRECATED/redux';
import type { State as ReduxState } from '../../reducers/root';

export type Props = ReduxProps & ComputedProps & ComponentProps;

type ComputedProps = {
  callToAction: string | null,
  canSubmit: bool,
  providerPendingLoginID: ID | null,
};

type ComponentProps = {
  enableInteraction: bool,
  page: AccountVerificationPage,
};

class AccountVerificationFooter extends Component<Props> {
  render() {
    return (
      <FooterWithButtons
        buttonLayout={this._getFooterButtonLayout()}
        onPress={this._onFooterButtonPress}
      />
    );
  }

  _getFooterButtonLayout() {
    const {callToAction, canSubmit, enableInteraction} = this.props;
    if (this.props.page.type === 'LOGIN') {
      invariant(
        this.props.callToAction,
        'Expecting call to action to exist when page is type LOGIN',
      );
      return {
        isLeftButtonDisabled: !enableInteraction,
        isRightButtonDisabled:
          !enableInteraction || !canSubmit,
        leftButtonText: 'EXIT',
        rightButtonText: callToAction,
        type: 'LEFT_AND_RIGHT',
      };
    }
    return {
      centerButtonText: 'EXIT',
      isCenterButtonDisabled: !enableInteraction,
      type: 'CENTER',
    };
  }

  _onFooterButtonPress = (button: 'LEFT' | 'RIGHT' | 'CENTER'): void => {
    if (this._isCancelButton(button)) {
      this.props.dispatch(dismissAccountVerification());
      return;
    }
    // Otherwise, it is the login button.
    invariant(
      this.props.page.type === 'LOGIN',
      'Expected to be on login page when login button is pressed',
    );
    const providerID = this.props.page.selectedProvider.id;
    this.props.dispatch(submitYodleeLoginFormForProviderID(providerID));
  };

  _isCancelButton(button: 'LEFT' | 'RIGHT' | 'CENTER') {
    return button === 'CENTER' || button === 'LEFT';
  }
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  const loginForm =
    props.page.type === 'LOGIN'
      ? state.loginForms.loginFormContainer[props.page.selectedProvider.id]
      : null;

  const canSubmit = Boolean(
    loginForm && calculateCanSubmitLoginForm(loginForm),
  );
  const callToAction = loginForm
    ? calculateCallToActionForLoginForm(loginForm)
    : null;

  return {
    canSubmit,
    callToAction,
    providerPendingLoginID: state.loginForms.providerPendingLoginID,
  };
}

function calculateCallToActionForLoginForm(loginForm: YodleeLoginForm): string {
  return loginForm.formType === 'login' ? 'LOGIN' : 'SUBMIT';
}

function calculateCanSubmitLoginForm(loginForm: YodleeLoginForm): bool {
  for (const row of loginForm.row) {
    for (const field of row.field) {
      if (!field.isOptional && field.value.length === 0) {
        return false;
      }
    }
  }
  return true;
}

export default connect(mapReduxStateToProps)(AccountVerificationFooter);
