/* @flow */

import { hasNetworkConnection } from '../store/state-utils';
import {
  networkRequestFailure,
  networkRequestStart,
  networkRequestSuccess,
} from '../actions/network';

import type { Next, Store } from '../typesDEPRECATED/redux';

let nextIDNumber: number = 1;

export function handleNetworkRequest<T>(
  store: Store,
  next: Next,
  domain: string,
  deferred: () => Promise<T>,
): Promise<T> {
  const requestID = `request-${nextIDNumber}`;
  nextIDNumber = (nextIDNumber + 1) % 1000;

  return Promise.resolve()
    .then(() => next(networkRequestStart(requestID, domain)))
    .then(() => deferred())
    .then(result => {
      next(networkRequestSuccess(requestID));
      return result;
    })
    .catch(error => {
      next(networkRequestFailure(requestID));
      throw error;
    });
}
