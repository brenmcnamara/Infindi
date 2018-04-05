/* @flow */

import React from 'react';
import TextDesign from '../design/text';

import uuid from 'uuid/v4';

import { requestInfoModal } from '../actions/modal';
import { Text } from 'react-native';

import type { Action$RequestModal } from '../actions/modal';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';

export type Action =
  | Action$ClearLoginForm
  | Action$DismissAccountVerification
  | Action$RequestAccountVerification
  | Action$SubmitYodleeLoginFormFailure
  | Action$SubmitYodleeLoginFormInitialize
  | Action$SubmitYodleeLoginFormSuccess
  | Action$UpdateLoginForm;

export const PROVIDER_LOGIN_MODAL_ID = 'YODLEE_LOGIN';

const UNSUPPORTED_MODAL_ID = 'UNSUPPORTED_MODAL';

export type Action$RequestAccountVerification = {|
  +type: 'REQUEST_ACCOUNT_VERIFICATION',
|};

export function requestAccountVerification() {
  return { type: 'REQUEST_ACCOUNT_VERIFICATION' };
}

export type Action$DismissAccountVerification = {|
  +type: 'DISMISS_ACCOUNT_VERIFICATION',
|};

export function dismissAccountVerification() {
  return { type: 'DISMISS_ACCOUNT_VERIFICATION' };
}

export function unsupportedProvider(reason: string): Action$RequestModal {
  const title = 'Unsupported Provider';
  return requestInfoModal({
    id: UNSUPPORTED_MODAL_ID,
    priority: 'USER_REQUESTED',
    render: () => <Text style={TextDesign.normal}>{reason}</Text>,
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
