/* @flow */

/**
 * Contains all the endpoints for calling the infindi backend service. The
 * backend requires that the user be authenticated, which is done through the
 * normal Firebase login flow.
 */

import Environment from './modules/Environment';

import invariant from 'invariant';

import type { ID, Pointer } from 'common/types/core';
import type { LoginPayload } from 'common/lib/models/Auth';
import type { PlaidDownloadStatus } from 'common/lib/models/PlaidCredentials';

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

export type CreatePlaidCredentialsPayload = Pointer<'PlaidCredentials'>;

export async function genCreatePlaidCredentials(
  publicToken: string,
  metadata: Object,
): Promise<CreatePlaidCredentialsPayload> {
  await Environment.genLazyLoad();
  const uri = createURI('/plaid/credentials');
  const json = await genPostRequest(uri, { publicToken, metadata });
  return json.data;
}

// -----------------------------------------------------------------------------
//
// CREATE PLAID DOWNLOAD REQUEST
//
// -----------------------------------------------------------------------------

export type CreatePlaidDownloadRequestPayload = Pointer<'JobRequest'>;

export async function genCreatePlaidDownloadRequest(
  credentialsID: string,
): Promise<CreatePlaidDownloadRequestPayload> {
  await Environment.genLazyLoad();
  const uri = createURI(`/plaid/download/${credentialsID}`);
  const json = await genPostRequest(uri, {});
  return json.data;
}

// -----------------------------------------------------------------------------
//
// GET PLAID DOWNLOAD STATUS
//
// -----------------------------------------------------------------------------

export type PlaidDownloadStatusPayload = { [itemID: ID]: PlaidDownloadStatus };

export async function genPlaidDownloadStatus(): Promise<PlaidDownloadStatusPayload,> {
  await Environment.genLazyLoad();
  const uri = createURI('/plaid/credentials/status');
  const json = await genGetRequest(uri);
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
  return await response.json();
}

function createURI(path: string): string {
  return `${Environment.getHostname()}${path}`;
}
