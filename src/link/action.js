/* @flow */

import React from 'react';
import Themes from '../design/themes';
import YodleeLoginFormModal, {
  TransitionInMillis as YodleeLoginFormModalTransitionInMillis,
  TransitionOutMillis as YodleeLoginFormModalTransitionOutMillis,
} from './components/YodleeLoginFormModal.react';

import uuid from 'uuid/v4';

import { dismissModal, requestInfoModal } from '../actions/modal';
import { Text } from 'react-native';

import type { Action$RequestModal } from '../actions/modal';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';

export type Action =
  | Action$ClearLoginForm
  | Action$ExitAccountVerification
  | Action$RequestProviderLogin
  | Action$RequestProviderSearch
  | Action$SubmitYodleeLoginFormFailure
  | Action$SubmitYodleeLoginFormInitialize
  | Action$SubmitYodleeLoginFormSuccess
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

export type Action$RequestProviderSearch = {|
  +type: 'REQUEST_PROVIDER_SEARCH',
|};

export function requestProviderSearch() {
  return { type: 'REQUEST_PROVIDER_SEARCH' };
}

export type Action$RequestProviderLogin = {|
  +providerID: ID,
  +type: 'REQUEST_PROVIDER_LOGIN',
|};

export function requestProviderLogin(providerID: ID) {
  return { providerID, type: 'REQUEST_PROVIDER_LOGIN' };
}

export type Action$UpdateProviderSearchText = {|
  +searchText: string,
  +type: 'UPDATE_PROVIDER_SEARCH_TEXT',
|};

export function updateProviderSearchText(searchText: string) {
  return {
    searchText,
    type: 'UPDATE_PROVIDER_SEARCH_TEXT',
  };
}

export function unsupportedProvider(reason: string): Action$RequestModal {
  const title = 'Unsupported Provider';
  return requestInfoModal({
    id: UNSUPPORTED_MODAL_ID,
    priority: 'USER_REQUESTED',
    render: () => (
      <Text style={Themes.primary.getTextStyleNormal()}>{reason}</Text>
    ),
    title,
  });
}

export type Action$SubmitYodleeLoginFormInitialize = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE',
|};

export type Action$SubmitYodleeLoginFormSuccess = {|
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_YODLEE_LOGIN_FORM_SUCCESS',
|};

export type Action$SubmitYodleeLoginFormFailure = {|
  +error: Object,
  +operationID: ID,
  +providerID: ID,
  +type: 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE',
|};

export function submitYodleeLoginFormForProviderID(providerID: ID) {
  return {
    providerID,
    operationID: uuid(),
    type: 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE',
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
    shouldIgnoreRequestingExistingModal: false,
    type: 'REQUEST_MODAL',
  };
}

export function dismissLoginFormModal(providerID: ID) {
  return dismissModal(`LOGIN_FORM_${providerID}`);
}
