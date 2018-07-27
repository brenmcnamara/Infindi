/* @flow */

/**
 * Contains all the endpoints for calling the infindi backend service. The
 * backend requires that the user be authenticated, which is done through the
 * normal Firebase login flow.
 */

import Provider from 'common/lib/models/Provider';
import Store from './store'; // TODO: Should not access directly

import invariant from 'invariant';

import type { ID, Pointer } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee-v1.0';
import type { LoginPayload, SignUpForm } from 'common/lib/models/Auth';
import type { ReduxState } from './store';

let loginPayload: LoginPayload | null = null;

export type ErrorPayload = {|
  +errorCode: string,
  +errorMessage: string,
|};

function setLoginPayload(_loginPayload: LoginPayload): void {
  loginPayload = _loginPayload;
}

function clearLoginPayload(): void {
  loginPayload = null;
}

// -----------------------------------------------------------------------------
//
// CREATE USER
//
// -----------------------------------------------------------------------------

async function genCreateUser(signUpForm: SignUpForm): Promise<Pointer<'User'>> {
  const uri = createURI('/v1/users');
  const body = { signUpForm };
  const response = await genPostRequest(uri, body, 'DO_NOT_AUTHORIZE');
  return response.data.userRef;
}

// -----------------------------------------------------------------------------
//
// QUERY YODLEE PROVIDERS
//
// -----------------------------------------------------------------------------

async function genQueryProviders(
  search: string,
  limit: number,
  page: number,
): Promise<Array<Provider>> {
  const uri = createURI(
    `/v1/providers/query?search=${search}&limit=${limit}&page=${page}`,
  );
  const response = await genGetRequest(uri);
  return response.data.providers.map(p => Provider.fromRaw(p));
}

// -----------------------------------------------------------------------------
//
// POST LOGIN FORM
//
// -----------------------------------------------------------------------------

async function genSetProviderLoginForm(
  providerID: ID,
  loginForm: YodleeLoginForm,
): Promise<Pointer<'AccountLink'>> {
  const uri = createURI(`/v1/providers/${providerID}/loginForm`);
  const response = await genPostRequest(uri, { loginForm });
  return response.data.accountLinkRef;
}

// -----------------------------------------------------------------------------
//
// POST MFA FORM
//
// -----------------------------------------------------------------------------

async function genSetProviderMFAForm(
  providerID: ID,
  mfaForm: YodleeLoginForm,
): Promise<Pointer<'AccountLink'>> {
  const uri = createURI(`/v1/providers/${providerID}/mfaForm`);
  const response = await genPostRequest(uri, { mfaForm });
  return response.data.accountLinkRef;
}

// -----------------------------------------------------------------------------
//
// UTILITIES
//
// -----------------------------------------------------------------------------

function getLoginPayload(): LoginPayload {
  invariant(loginPayload, 'You must initialize backend before trying to use');
  return loginPayload;
}

// TODO: If it is a failing status, need to throw error.
async function genPostRequest<T: Object>(
  uri: string,
  body: Object,
  auth: 'AUTHORIZE' | 'DO_NOT_AUTHORIZE' = 'AUTHORIZE',
): Promise<T> {
  const headers =
    auth === 'AUTHORIZE'
      ? {
          Accept: 'application/json',
          Authorization: getLoginPayload().idToken,
          'Content-Type': 'application/json',
        }
      : {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        };
  const response = await fetch(uri, {
    headers,
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (response.status >= 400) {
    let errorJSON;
    try {
      errorJSON = await response.json();
    } catch (_) {
      throw {
        errorCode: 'infindi/service-error',
        errorMessage: `Failed with status ${response.status}`,
      };
    }
    throw errorJSON;
  }
  return await response.json();
}

// TODO: If it is a failing status, need to throw an error.
async function genGetRequest<T: Object>(uri: string): Promise<T> {
  const { idToken } = getLoginPayload();
  const response = await fetch(uri, {
    headers: {
      Accept: 'application/json',
      Authorization: idToken,
      'Content-Type': 'application/json',
    },
    method: 'GET',
  });
  if (response.status >= 400) {
    let errorJSON;
    try {
      errorJSON = await response.json();
    } catch (_) {
      throw {
        errorCode: 'infindi/service-error',
        errorMessage: `Failed with status ${response.status}`,
      };
    }
    throw errorJSON;
  }
  return await response.json();
}

function createURI(path: string): string {
  const state: ReduxState = Store.getState();
  const { hostname } = state.settings;
  return `${hostname}${path}`;
}

export default {
  clearLoginPayload,
  genCreateUser,
  genQueryProviders,
  genSetProviderLoginForm,
  genSetProviderMFAForm,
  setLoginPayload,
};
