/* @flow */

/**
 * Contains all the endpoints for calling the infindi backend service. The
 * backend requires that the user be authenticated, which is done through the
 * normal Firebase login flow.
 */

import Environment from './modules/Environment';

import invariant from 'invariant';

import type { ID, Pointer } from 'common/types/core';
import type { LoginForm as YodleeLoginForm } from 'common/types/yodlee';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { Provider } from 'common/lib/models/Provider';

let loginPayload: ?LoginPayload = null;

export type ErrorPayload = {|
  +errorCode: string,
  +errorMessage: string,
|};

export function initialize(_loginPayload: LoginPayload): void {
  loginPayload = _loginPayload;
}

// -----------------------------------------------------------------------------
//
// QUERY YODLEE PROVIDERS
//
// -----------------------------------------------------------------------------

export type QueryProvidersPayload = {|
  +data: Array<Provider>,
|};

async function genQueryProviders(
  query: string,
  limit: number,
  page: number,
): Promise<QueryProvidersPayload> {
  await Environment.genLazyLoad();
  const uri = createURI(
    `/yodlee/providers/search?query=${query}&limit=${limit}&page=${page}`,
  );
  return await genGetRequest(uri);
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
  await Environment.genLazyLoad();
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
): Promise<T> {
  const { idToken } = getLoginPayload();
  const response = await fetch(uri, {
    headers: {
      Accept: 'application/json',
      Authorization: idToken,
      'Content-Type': 'application/json',
    },
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
  return `${Environment.getHostname()}${path}`;
}

export default {
  genQueryProviders,
  genYodleeSubmitProviderLoginForm,
};
