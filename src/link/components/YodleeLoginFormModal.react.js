/* @flow */

import Colors from '../../design/colors';
import ModalTransition, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from '../../components/shared/ModalTransition.react';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import TextDesign from '../../design/text';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  calculateLoginFormCallToActionForProviderID,
  calculateCanSubmitLoginFormForProviderID,
} from '../utils';
import { connect } from 'react-redux';
import { getAccountLinkForProviderID } from '../../common/state-utils';
import { updateLoginForm, submitYodleeLoginFormForProviderID } from '../action';

import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { ReduxProps, ReduxState } from '../../typesDEPRECATED/redux';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComputedProps = {
  callToAction: string,
  canSubmit: boolean,
  isLoading: boolean,
  loginForm: YodleeLoginForm,
};

type ComponentProps = {
  providerID: ID,
  transitionStage: 'IN' | 'OUT' | 'TRANSITION_IN' | 'TRANSITION_OUT',
};

const EMPTY_FUNCTION = () => {};

export const TransitionInMillis = ModalTransitionInMillis;
export const TransitionOutMillis = ModalTransitionOutMillis;

class YodleeLoginFormModal extends Component<Props> {
  render() {
    return (
      <ModalTransition
        onPressBackground={EMPTY_FUNCTION}
        show={
          this.props.transitionStage === 'IN' ||
          this.props.transitionStage === 'TRANSITION_IN'
        }
      >
        <View style={styles.root}>
          <View style={styles.header}>
            <Text style={[TextDesign.header3, styles.headerText]}>
              {'Finish Login Process'}
            </Text>
          </View>
          <YodleeLoginFormComponent
            enableInteraction={true}
            loginForm={this.props.loginForm}
            onChangeLoginForm={this._onChangeLoginForm}
          />
          <View style={styles.footer}>
            {this.props.isLoading ? (
              <ActivityIndicator size="small" />
            ) : (
              <TextButton
                isDisabled={!this.props.canSubmit}
                layoutType="FILL_PARENT"
                onPress={this._onPressSubmit}
                size="SMALL"
                text={this.props.callToAction}
                type="PRIMARY"
              />
            )}
          </View>
        </View>
      </ModalTransition>
    );
  }

  _onChangeLoginForm = (loginForm: YodleeLoginForm): void => {
    this.props.dispatch(updateLoginForm(this.props.providerID, loginForm));
  };

  _onPressSubmit = (): void => {
    const { providerID } = this.props;
    this.props.dispatch(submitYodleeLoginFormForProviderID(providerID));
  };
}

function mapReduxStateToProps(
  state: ReduxState,
  props: ComponentProps,
): ComputedProps {
  const { providerID } = props;
  const loginForm = state.accountVerification.loginFormContainer[providerID];
  const callToAction = calculateLoginFormCallToActionForProviderID(
    state,
    providerID,
  );
  const canSubmit = calculateCanSubmitLoginFormForProviderID(state, providerID);
  const accountLink = getAccountLinkForProviderID(state, providerID);
  const pendingLoginRequest =
    state.accountVerification.providerPendingLoginRequestMap[providerID];
  const isLoading =
    Boolean(pendingLoginRequest) ||
    !accountLink ||
    accountLink.status !== 'MFA / PENDING_USER_INPUT';
  return {
    callToAction,
    canSubmit,
    loginForm,
    isLoading,
  };
}

export default connect(mapReduxStateToProps)(YodleeLoginFormModal);

const styles = StyleSheet.create({
  footer: {
    borderColor: Colors.BORDER,
    borderTopWidth: 1,
    height: 40,
    justifyContent: 'center',
  },

  header: {
    borderColor: Colors.BORDER,
    borderBottomWidth: 1,
    flexDirection: 'row',
    paddingVertical: 8,
  },

  headerText: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
  },

  root: {
    backgroundColor: Colors.BACKGROUND,
    borderColor: Colors.BORDER,
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 4,
  },
});
