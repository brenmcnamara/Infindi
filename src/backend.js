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
import type { ProviderRaw } from 'common/lib/models/Provider';

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

export type CreateUserPayload = {|
  +data: Pointer<'User'>,
|};

async function genCreateUser(signUpForm: SignUpForm): Promise<Pointer<'User'>> {
  const uri = createURI('/users');
  const response: CreateUserPayload = await genPostRequest(
    uri,
    { signUpForm },
    'DO_NOT_AUTHORIZE',
  );
  return response.data;
}

// -----------------------------------------------------------------------------
//
// QUERY YODLEE PROVIDERS
//
// -----------------------------------------------------------------------------

type QueryProvidersPayload = {|
  +data: Array<ProviderRaw>,
|};

async function genQueryProviders(
  query: string,
  limit: number,
  page: number,
): Promise<Array<Provider>> {
  const uri = createURI(
    `/yodlee/providers/search?query=${query}&limit=${limit}&page=${page}`,
  );
  const response: QueryProvidersPayload = await genGetRequest(uri);
  return response.data.map(p => Provider.fromRaw(p));
}

// -----------------------------------------------------------------------------
//
// POST YODLEE PROVIDER LOGIN
//
// -----------------------------------------------------------------------------

export type YodleeProviderSubmitLoginFormPayload = Pointer<'AccountLink'>;

async function genYodleeSubmitProviderLoginForm(
  providerID: ID,
  loginForm: YodleeLoginForm,
): Promise<YodleeProviderSubmitLoginFormPayload> {
  const uri = createURI(`/yodlee/providers/${providerID}/loginForm`);
  const json = await genPostRequest(uri, { loginForm });
  return json.data;
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
  const hostname = Store.config.hostname;
  return `${hostname}${path}`;
}

export default {
  clearLoginPayload,
  genCreateUser,
  genQueryProviders,
  genYodleeSubmitProviderLoginForm,
  setLoginPayload,
};
