/* @flow */

import AccountVerification, {
  TransitionInMillis as AccountVerificationTransitionInMillis,
  TransitionOutMillis as AccountVerificationTransitionOutMillis,
} from './components/AccountVerification.react';
import InfoModal, {
  TransitionInMillis as InfoModalTransitionInMillis,
  TransitionOutMillis as InfoModalTransitionOutMillis,
} from '../components/shared/InfoModal.react';
import React from 'react';
import TextDesign from '../design/text';

import { Text } from 'react-native';

import type {
  Action$DismissModal,
  Action$RequestModal,
} from '../actions/modal';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { Provider } from 'common/lib/models/Provider';

export type Action =
  | Action$RequestProviderLogin
  | Action$RequestProviderLoginFailed
  | Action$UpdateLoginForm;

export const PROVIDER_LOGIN_MODAL_ID = 'YODLEE_LOGIN';

const UNSUPPORTED_MODAL_ID = 'UNSUPPORTED_MODAL';

export function requestAccountVerification(): Action$RequestModal {
  return {
    modal: {
      id: PROVIDER_LOGIN_MODAL_ID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => <AccountVerification transitionStage="IN" />,
      renderOut: () => <AccountVerification transitionStage="OUT" />,
      renderTransitionIn: () => (
        <AccountVerification transitionStage="TRANSITION_IN" />
      ),
      renderTransitionOut: () => (
        <AccountVerification transitionStage="TRANSITION_OUT" />
      ),
      transitionInMillis: AccountVerificationTransitionInMillis,
      transitionOutMillis: AccountVerificationTransitionOutMillis,
    },
    shouldIgnoreRequestingExistingModal: true,
    type: 'REQUEST_MODAL',
  };
}

export function dismissAccountVerification(): Action$DismissModal {
  return {
    modalID: PROVIDER_LOGIN_MODAL_ID,
    shouldIgnoreDismissingNonExistantModal: true,
    type: 'DISMISS_MODAL',
  };
}

export function unsupportedProvider(reason: string): Action$RequestModal {
  const title = 'Unsupported Provider';
  return {
    modal: {
      id: UNSUPPORTED_MODAL_ID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => (
        <InfoModal modalID={UNSUPPORTED_MODAL_ID} show={true} title={title}>
          <Text style={TextDesign.normal}>{reason}</Text>
        </InfoModal>
      ),
      renderOut: () => (
        <InfoModal modalID={UNSUPPORTED_MODAL_ID} show={false} title={title}>
          <Text style={TextDesign.normal}>{reason}</Text>
        </InfoModal>
      ),
      renderTransitionIn: () => (
        <InfoModal modalID={UNSUPPORTED_MODAL_ID} show={true} title={title}>
          <Text style={TextDesign.normal}>{reason}</Text>
        </InfoModal>
      ),
      renderTransitionOut: () => (
        <InfoModal modalID={UNSUPPORTED_MODAL_ID} show={false} title={title}>
          <Text style={TextDesign.normal}>{reason}</Text>
        </InfoModal>
      ),
      transitionInMillis: InfoModalTransitionInMillis,
      transitionOutMillis: InfoModalTransitionOutMillis,
    },
    shouldIgnoreRequestingExistingModal: false,
    type: 'REQUEST_MODAL',
  };
}

export type Action$RequestProviderLogin = {|
  +provider: Provider,
  +type: 'REQUEST_PROVIDER_LOGIN',
|};

export function requestProviderLogin(provider: Provider) {
  return {
    provider,
    type: 'REQUEST_PROVIDER_LOGIN',
  };
}

export type Action$RequestProviderLoginFailed = {|
  +error: Error,
  +provider: Provider,
  +type: 'REQUEST_PROVIDER_LOGIN_FAILED',
|};

export function requestProviderLoginFailed(provider: Provider, error: Error) {
  return {
    error,
    provider,
    type: 'REQUEST_PROVIDER_LOGIN_FAILED',
  };
}

export type Action$UpdateLoginForm = {|
  +loginForm: YodleeLoginForm,
  +providerID: ID,
  +type: 'UPDATE_LOGIN_FORM',
|};

export function updateLoginForm(providerID: ID, loginForm: YodleeLoginForm) {
  return {
    loginForm,
    providerID,
    type: 'UPDATE_LOGIN_FORM',
  };
}
