/* @flow */

import invariant from 'invariant';

import type { AccountLink } from 'common/lib/models/AccountLink';
import type { AccountLinkContainer } from '../../data-model/types';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { LoginFormContainer } from '../types';
import type { Provider } from 'common/lib/models/Provider';
import type { PureAction } from '../../typesDEPRECATED/redux';

export type State = {
  +loginFormContainer: LoginFormContainer,
  +loginFormSource: { [providerID: ID]: 'ACCOUNT_LINK' | 'PROVIDER' },
  +providerPendingLoginID: ID | null,
};

const DEFAULT_STATE: State = {
  loginFormContainer: {},
  loginFormSource: {},
  providerPendingLoginID: null,
};

export default function loginForms(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'FETCH_PROVIDERS_SUCCESS': {
      // Refresh the login form container.
      const loginFormContainer = { ...state.loginFormContainer };
      const loginFormSource = { ...state.loginFormSource };
      for (const providerID of action.ordering) {
        const provider = action.container[providerID];
        if (loginFormSource[providerID] !== 'ACCOUNT_LINK') {
          loginFormContainer[providerID] = getYodleeLoginForm(provider);
          loginFormSource[providerID] = 'PROVIDER';
        }
      }
      return { ...state, loginFormContainer, loginFormSource };
    }

    case 'REQUEST_PROVIDER_LOGIN': {
      // TODO: This is lame! Fix it!
      invariant(
        !state.providerPendingLoginID,
        'Only supports 1 pending login at a time',
      );
      return { ...state, providerPendingLoginID: action.provider.id };
    }

    case 'REQUEST_PROVIDER_LOGIN_FAILED': {
      invariant(
        state.providerPendingLoginID,
        'Expecting pending login on provider',
      );
      return { ...state, providerPendingLoginID: null };
    }

    case 'CONTAINER_DOWNLOAD_FINISHED': {
      if (!state.providerPendingLoginID) {
        return state;
      }
      const providerID = state.providerPendingLoginID;
      if (action.modelName !== 'AccountLink') {
        return state;
      }
      // $FlowFixMe - This is correct.
      const container: AccountLinkContainer = action.container;
      const accountLink = getAccountLinkForProvider(container, providerID);
      if (!accountLink) {
        return state;
      }
      return { ...state, providerIDPendingLogin: null };
    }

    case 'UPDATE_LOGIN_FORM': {
      const { loginForm, providerID } = action;
      const loginFormContainer = { ...state.loginFormContainer };
      loginFormContainer[providerID] = loginForm;
      return { ...state, loginFormContainer };
    }
  }
  return state;
}

function getAccountLinkForProvider(
  accountLinkContainer: AccountLinkContainer,
  providerID: ID,
): AccountLink | null {
  for (const id in accountLinkContainer) {
    if (
      accountLinkContainer.hasOwnProperty(id) &&
      accountLinkContainer[id].providerRef.refID === providerID
    ) {
      return accountLinkContainer[id];
    }
  }
  return null;
}

function getYodleeLoginForm(provider: Provider): YodleeLoginForm {
  const { sourceOfTruth } = provider;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting provider to come from YODLEE',
  );
  return sourceOfTruth.value.loginForm;
}
