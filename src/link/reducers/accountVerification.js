/* @flow */

import invariant from 'invariant';

import { isInMFA } from 'common/lib/models/AccountLink';
import { isSameLoginForm } from '../utils';

import type { AccountVerificationPage, LoginFormContainer } from '../types';
import type { ID } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { Provider } from 'common/lib/models/Provider';
import type { PureAction } from '../../typesDEPRECATED/redux';

export type State = {
  +defaultLoginFormContainer: LoginFormContainer,
  +didCompleteInitialSearch: boolean,
  +loginFormContainer: LoginFormContainer,
  +loginFormSource: { [providerID: ID]: 'ACCOUNT_LINK' | 'PROVIDER' },
  +page: AccountVerificationPage | null,
  +providerPendingLoginID: ID | null,
  +providerSearchText: string,
};

const DEFAULT_STATE: State = {
  defaultLoginFormContainer: {},
  didCompleteInitialSearch: false,
  loginFormContainer: {},
  loginFormSource: {},
  page: null,
  providerPendingLoginID: null,
  providerSearchText: '',
};

export default function accountVerification(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'EXIT_ACCOUNT_VERIFICATION': {
      return { ...state, page: null };
    }

    case 'FETCH_PROVIDERS_SUCCESS': {
      // Refresh the login form container.
      const defaultLoginFormContainer = { ...state.defaultLoginFormContainer };
      const loginFormContainer = { ...state.loginFormContainer };
      const loginFormSource = { ...state.loginFormSource };
      for (const providerID of action.ordering) {
        const provider = action.container[providerID];
        const loginForm = getYodleeLoginForm(provider);
        defaultLoginFormContainer[providerID] = loginForm;
        if (loginFormSource[providerID] !== 'ACCOUNT_LINK') {
          loginFormContainer[providerID] = loginForm;
          loginFormSource[providerID] = 'PROVIDER';
        }
      }
      return {
        ...state,
        defaultLoginFormContainer,
        didCompleteInitialSearch: true,
        loginFormContainer,
        loginFormSource,
      };
    }

    case 'FETCH_PROVIDERS_FAILURE': {
      return { ...state, didCompleteInitialSearch: true };
    }

    case 'REQUEST_PROVIDER_LOGIN': {
      return {
        ...state,
        page: { type: 'LOGIN', providerID: action.providerID },
      };
    }

    case 'REQUEST_PROVIDER_SEARCH': {
      return {
        ...state,
        page: { type: 'SEARCH' },
      };
    }

    case 'UPDATE_PROVIDER_SEARCH_TEXT': {
      return {
        ...state,
        providerSearchText: action.searchText,
      };
    }

    case 'SUBMIT_YODLEE_LOGIN_FORM_INITIALIZE': {
      // TODO: This is lame! Fix it!
      invariant(
        !state.providerPendingLoginID,
        'Only supports 1 pending login at a time',
      );
      return { ...state, providerPendingLoginID: action.providerID };
    }

    case 'SUBMIT_YODLEE_LOGIN_FORM_FAILURE': {
      invariant(
        state.providerPendingLoginID,
        'Expecting pending login on provider',
      );
      return { ...state, providerPendingLoginID: null };
    }

    case 'CONTAINER_DOWNLOAD_FINISHED': {
      if (action.modelName !== 'AccountLink') {
        return state;
      }
      // $FlowFixMe - This is correct.
      const container: AccountLinkContainer = action.container;

      const loginFormContainer = { ...state.loginFormContainer };
      const loginFormSource = { ...state.loginFormSource };

      // We need to scan the account links to see if any are in the process
      // of entering or exiting multi-factor authentication. If so, we need to
      // update the login form to the correct one for the provider associated
      // with the account link.
      for (const accountLinkID in container) {
        if (!container.hasOwnProperty(accountLinkID)) {
          continue;
        }

        const accountLink = container[accountLinkID];
        const providerID = accountLink.providerRef.refID;
        if (
          accountLink.sourceOfTruth.type === 'YODLEE' &&
          isInMFA(accountLink)
        ) {
          const { loginForm } = accountLink.sourceOfTruth;
          // NOTE: We will frequently end up fetching the account links before
          // the corresponding providers and login forms. Need to handle the
          // case where the login form for the provider of the associated
          // account link does not exist.
          const currentLoginForm = loginFormContainer[providerID] || null;
          if (
            currentLoginForm &&
            loginForm &&
            !isSameLoginForm(loginFormContainer[providerID], loginForm)
          ) {
            loginFormContainer[providerID] = loginForm;
            loginFormSource[providerID] = 'ACCOUNT_LINK';
          }
        } else if (
          accountLink.sourceOfTruth.type === 'YODLEE' &&
          loginFormSource[providerID] !== 'PROVIDER'
        ) {
          loginFormContainer[providerID] =
            state.defaultLoginFormContainer[providerID];
          loginFormSource[providerID] = 'PROVIDER';
        }
      }

      // NOTE: We are assuming here that once we get an update of account links
      // we are done waiting provider login to be pending. There can be race
      // conditions where this is not true.
      return {
        ...state,
        loginFormContainer,
        loginFormSource,
        providerPendingLoginID: null,
      };
    }

    case 'CLEAR_LOGIN_FORM': {
      const { providerID } = action;
      invariant(
        state.defaultLoginFormContainer[providerID],
        'Expecting a default login form to exist for provider: %s',
        providerID,
      );
      const loginFormContainer = { ...state.loginFormContainer };
      loginFormContainer[providerID] =
        state.defaultLoginFormContainer[providerID];
      return { ...state, loginFormContainer };
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

function getYodleeLoginForm(provider: Provider): YodleeLoginForm {
  const { sourceOfTruth } = provider;
  invariant(
    sourceOfTruth.type === 'YODLEE',
    'Expecting provider to come from YODLEE',
  );
  return sourceOfTruth.value.loginForm;
}
