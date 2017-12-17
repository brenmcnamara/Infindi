/* @flow */

/**
 * Contains all the endpoints for calling the infindi backend service. The
 * backend requires that the user be authenticated, which is done through the
 * normal Firebase login flow.
 */

import Environment from './modules/Environment';

import invariant from 'invariant';

import type { LoginPayload } from 'common/src/types/db';

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
// CREATE PLAID CREDENTIALS
//
// -----------------------------------------------------------------------------

export type CreatePlaidCredentialsPayload = {};

export async function genCreatePlaidCredentials(
  publicToken: string,
  metadata: Object,
): Promise<CreatePlaidCredentialsPayload> {
  const uri = createURI('/plaid/credentials');
  return await genPostRequest(uri, { publicToken, metadata });
}

// -----------------------------------------------------------------------------
//
// CREATE PLAID DOWNLOAD REQUEST
//
// -----------------------------------------------------------------------------

export type CreatePlaidDownloadRequestPayload = {};

export async function genCreatePlaidDownloadRequest(
  credentialsID: string,
): Promise<CreatePlaidDownloadRequestPayload> {
  const uri = createURI(`/plaid/download/${credentialsID}`);
  return await genPostRequest(uri, {});
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

async function genPostRequest<T: Object>(
  uri: string,
  body: Object,
): Promise<T> {
  console.log('genning post request');
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
  console.log('GOT RESPONSE FROM POST REQUEST', response);
  return await response.json();
}

function createURI(path: string): string {
  return `${Environment.getHostname()}${path}`;
}
