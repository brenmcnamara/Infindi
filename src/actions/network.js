/* @flow */

import type { ID } from 'common/src/types/core';

export type Action =
  | Action$NetworkRequestStart
  | Action$NetworkRequestSuccess
  | Action$NetworkRequestFailure;

export type Action$NetworkRequestStart = {|
  +domain: string,
  +requestID: ID,
  +type: 'NETWORK_REQUEST_START',
|};

export function networkRequestStart(requestID: ID, domain: string) {
  return {
    domain,
    requestID,
    type: 'NETWORK_REQUEST_START',
  };
}

export type Action$NetworkRequestSuccess = {|
  +requestID: ID,
  +type: 'NETWORK_REQUEST_SUCCESS',
|};

export function networkRequestSuccess(requestID: ID) {
  return {
    requestID,
    type: 'NETWORK_REQUEST_SUCCESS',
  };
}

export type Action$NetworkRequestFailure = {|
  +requestID: ID,
  +type: 'NETWORK_REQUEST_FAILURE',
|};

export function networkRequestFailure(requestID: ID) {
  return {
    requestID,
    type: 'NETWORK_REQUEST_FAILURE',
  };
}
