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
import type { Provider as YodleeProvider } from 'common/lib/models/YodleeProvider';

export type Action = Action$RequestProviderLogin;

const PROVIDER_LOGIN_ID = 'YODLEE_LOGIN';
const UNSUPPORTED_MODAL_ID = 'UNSUPPORTED_MODAL';

export function requestAccountVerification(): Action$RequestModal {
  return {
    modal: {
      id: PROVIDER_LOGIN_ID,
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
    type: 'REQUEST_MODAL',
  };
}

export function dismissAccountVerification(): Action$DismissModal {
  return {
    modalID: PROVIDER_LOGIN_ID,
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
    type: 'REQUEST_MODAL',
  };
}

export type Action$RequestProviderLogin = {|
  +provider: YodleeProvider,
  +type: 'REQUEST_PROVIDER_LOGIN',
|};

export function requestProviderLogin(provider: YodleeProvider) {
  return {
    provider,
    type: 'REQUEST_PROVIDER_LOGIN',
  };
}
