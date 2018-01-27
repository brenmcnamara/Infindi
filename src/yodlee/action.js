/* @flow */

import AccountVerification, {
  TransitionInMillis,
  TransitionOutMillis,
} from './AccountVerification.react';
import React from 'react';

import type {
  Action$DismissModal,
  Action$RequestModal,
} from '../actions/modal';

const PROVIDER_LOGIN_ID = 'YODLEE_LOGIN';

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
      transitionInMillis: TransitionInMillis,
      transitionOutMillis: TransitionOutMillis,
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
