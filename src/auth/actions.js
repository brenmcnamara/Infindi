/* @flow */

import { dismissBanner, requestBanner } from '../banner/Actions';

import type { AuthStatus } from './types';
import type { LoginCredentials, SignUpForm } from 'common/lib/models/Auth';

export type Action =
  | Action$AuthStatusChange
  | Action$LoginRequest
  | Action$LogoutRequest
  | Action$ShowSignUpScreen
  | Action$SignUpRequest;

type Action$SignUpRequest = {|
  +signUpForm: SignUpForm,
  +type: 'SIGN_UP_REQUEST',
|};

export function signUp(signUpForm: SignUpForm) {
  return {
    signUpForm,
    type: 'SIGN_UP_REQUEST',
  };
}

type Action$LoginRequest = {|
  +loginCredentials: LoginCredentials,
  +type: 'LOGIN_REQUEST',
|};

export function login(loginCredentials: LoginCredentials) {
  return { loginCredentials, type: 'LOGIN_REQUEST' };
}

type Action$LogoutRequest = {|
  +type: 'LOGOUT_REQUEST',
|};

export function logout() {
  return { type: 'LOGOUT_REQUEST' };
}

// NOTE: Used by middleware
type Action$AuthStatusChange = {|
  +status: AuthStatus,
  +type: 'AUTH_STATUS_CHANGE',
|};

export function showSignUpValidationError(errorMessage: string) {
  return requestBanner({
    bannerChannel: 'SIGN_UP',
    bannerType: 'ALERT',
    id: 'SIGN_UP_VALIDATION_ERROR',
    priority: 'NORMAL',
    showSpinner: false,
    text: errorMessage,
  });
}

export function removeSignUpValidationError() {
  return dismissBanner(
    'SIGN_UP_VALIDATION_ERROR',
    /* shouldThrowOnDismissingNonExistantToast */ false,
  );
}

type Action$ShowSignUpScreen = {|
  +isShowing: boolean,
  +type: 'SHOW_SIGN_UP_SCREEN',
|};

export function showSignUpScreen(isShowing: boolean) {
  return {
    isShowing,
    type: 'SHOW_SIGN_UP_SCREEN',
  };
}
