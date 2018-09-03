/* @flow */

import React from 'react';
import YodleeLoginFormModal, {
  TransitionInMillis as YodleeLoginFormModalTransitionInMillis,
  TransitionOutMillis as YodleeLoginFormModalTransitionOutMillis,
} from './components/YodleeLoginFormModal.react';

import uuid from 'uuid/v4';

import { dismissModal, requestInfoModal } from '../modal/Actions';
import { GetTheme } from '../design/components/Theme.react';
import { Text } from 'react-native';

import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';

export type Action =
  | Action$ClearLoginForm
  | Action$ExitAccountVerification
  | Action$SubmitLoginFormFailure
  | Action$SubmitLoginFormInitialize
  | Action$SubmitLoginFormSuccess
  | Action$SubmitMFAFormFailure
  | Action$SubmitMFAFormInitialize
  | Action$SubmitMFAFormSuccess
  | Action$UpdateLoginForm
  | Action$UpdateProviderSearchText;

export const PROVIDER_LOGIN_MODAL_ID = 'YODLEE_LOGIN';

const UNSUPPORTED_MODAL_ID = 'UNSUPPORTED_MODAL';

export type Action$ExitAccountVerification = {|
  +type: 'EXIT_ACCOUNT_VERIFICATION',
|};

export function exitAccountVerification() {
  return { type: 'EXIT_ACCOUNT_VERIFICATION' };
}

export function unsupportedProvider(reason: string) {
  const title = 'Unsupported Provider';
  return requestInfoModal({
    id: UNSUPPORTED_MODAL_ID,
    priority: 'USER_REQUESTED',
    render: () => (
      <GetTheme>
        {theme => <Text style={theme.getTextStyleNormal()}>{reason}</Text>}
      </GetTheme>
    ),
    title,
  });
}

export type Action$SubmitLoginFormInitialize = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_LOGIN_FORM_INITIALIZE',
|};

export type Action$SubmitLoginFormSuccess = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_LOGIN_FORM_SUCCESS',
|};

export type Action$SubmitLoginFormFailure = {|
  +error: Object,
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_LOGIN_FORM_FAILURE',
|};

export function submitLoginFormForProviderID(providerID: ID) {
  return {
    providerID,
    operationID: uuid(),
    type: 'SUBMIT_LOGIN_FORM_INITIALIZE',
  };
}

export type Action$SubmitMFAFormInitialize = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_MFA_FORM_INITIALIZE',
|};

export type Action$SubmitMFAFormSuccess = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_MFA_FORM_SUCCESS',
|};

export type Action$SubmitMFAFormFailure = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_MFA_FORM_FAILURE',
|};

export function submitMFAFormForProviderID(providerID: ID) {
  return {
    providerID,
    operationID: uuid(),
    type: 'SUBMIT_MFA_FORM_INITIALIZE',
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

export type Action$ClearLoginForm = {|
  +providerID: ID,
  +type: 'CLEAR_LOGIN_FORM',
|};

export function clearLoginForm(providerID: ID) {
  return {
    providerID,
    type: 'CLEAR_LOGIN_FORM',
  };
}

export function requestLoginFormModal(providerID: ID) {
  const modalID = `LOGIN_FORM_${providerID}`;
  return {
    modal: {
      id: modalID,
      modalType: 'REACT_WITH_TRANSITION',
      priority: 'USER_REQUESTED',
      renderIn: () => (
        <YodleeLoginFormModal providerID={providerID} transitionStage="IN" />
      ),
      renderOut: () => (
        <YodleeLoginFormModal providerID={providerID} transitionStage="OUT" />
      ),
      renderTransitionIn: () => (
        <YodleeLoginFormModal
          providerID={providerID}
          transitionStage="TRANSITION_IN"
        />
      ),
      renderTransitionOut: () => (
        <YodleeLoginFormModal
          providerID={providerID}
          transitionStage="TRANSITION_OUT"
        />
      ),
      transitionInMillis: YodleeLoginFormModalTransitionInMillis,
      transitionOutMillis: YodleeLoginFormModalTransitionOutMillis,
    },
    type: 'REQUEST_MODAL',
  };
}

export function dismissLoginFormModal(providerID: ID) {
  return dismissModal(`LOGIN_FORM_${providerID}`);
}
