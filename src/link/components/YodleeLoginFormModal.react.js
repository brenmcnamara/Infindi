/* @flow */

import DataModelStateUtils from '../../data-model/state-utils';
import ModalTransition, {
  TransitionInMillis as ModalTransitionInMillis,
  TransitionOutMillis as ModalTransitionOutMillis,
} from '../../components/shared/ModalTransition.react';
import React, { Component } from 'react';
import TextButton from '../../components/shared/TextButton.react';
import YodleeLoginFormComponent from './YodleeLoginForm.react';

import invariant from 'invariant';

import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import {
  calculateLoginFormCallToActionForProviderID,
  calculateCanSubmitLoginFormForProviderID,
} from '../utils';
import { connect } from 'react-redux';
import { GetTheme } from '../../design/components/Theme.react';
import { updateLoginForm, submitYodleeLoginFormForProviderID } from '../action';

import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { ReduxProps, ReduxState } from '../../store';

export type Props = ReduxProps & ComponentProps & ComputedProps;

type ComputedProps = {
  callToAction: string,
  canSubmit: boolean,
  isLoading: boolean,
  loginForm: YodleeLoginForm | null,
};

type ComponentProps = {
  providerID: ID,
  transitionStage: 'IN' | 'OUT' | 'TRANSITION_IN' | 'TRANSITION_OUT',
};

const EMPTY_FUNCTION = () => {};

export const TransitionInMillis = ModalTransitionInMillis;
export const TransitionOutMillis = ModalTransitionOutMillis;

class YodleeLoginFormModal extends Component<Props> {
  shouldComponentUpdate(nextProps: Props): boolean {
    return Boolean(nextProps.loginForm);
  }

  render() {
    const { callToAction, canSubmit, loginForm } = this.props;
    invariant(loginForm, 'Trying to re-render without a login form');
    return (
      <GetTheme>
        {theme => (
          <ModalTransition
            animateOnMount={true}
            onPressBackground={EMPTY_FUNCTION}
            show={
              this.props.transitionStage === 'IN' ||
              this.props.transitionStage === 'TRANSITION_IN'
            }
          >
            <View
              style={[
                styles.root,
                {
                  backgroundColor: theme.color.backgroundMain,
                  borderColor: theme.color.borderNormal,
                },
              ]}
            >
              <View
                style={[
                  styles.header,
                  { borderColor: theme.color.borderNormal },
                ]}
              >
                <Text style={[theme.getTextStyleHeader3(), styles.headerText]}>
                  {'Finish Login Process'}
                </Text>
              </View>
              <YodleeLoginFormComponent
                enableInteraction={true}
                loginForm={loginForm}
                onChangeLoginForm={this._onChangeLoginForm}
              />
              <View
                style={[
                  styles.footer,
                  { borderColor: theme.color.borderNormal },
                ]}
              >
                {this.props.isLoading ? (
                  <ActivityIndicator size="small" />
                ) : (
                  <TextButton
                    isDisabled={!canSubmit}
                    layoutType="FILL_PARENT"
                    onPress={this._onPressSubmit}
                    size="SMALL"
                    text={callToAction}
                    type="PRIMARY"
                  />
                )}
              </View>
            </View>
          </ModalTransition>
        )}
      </GetTheme>
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
  const loginForm =
    state.accountVerification.loginFormContainer[providerID] || null;
  const callToAction = loginForm
    ? calculateLoginFormCallToActionForProviderID(state, providerID)
    : '';
  const canSubmit =
    Boolean(loginForm) &&
    calculateCanSubmitLoginFormForProviderID(state, providerID);
  const accountLink = DataModelStateUtils.getAccountLinkForProviderID(
    state,
    providerID,
  );
  const pendingLoginRequest =
    state.accountVerification.providerPendingLoginRequestMap[providerID];
  const isLoading =
    Boolean(pendingLoginRequest) ||
    !accountLink ||
    accountLink.status !== 'MFA / PENDING_USER_INPUT';
  return {
    callToAction,
    canSubmit,
    isLoading,
    loginForm,
  };
}

export default connect(mapReduxStateToProps)(YodleeLoginFormModal);

const styles = StyleSheet.create({
  footer: {
    borderTopWidth: 1,
    height: 40,
    justifyContent: 'center',
  },

  header: {
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
    borderRadius: 2,
    borderWidth: 1,
    marginHorizontal: 4,
  },
});
