/* @flow */

import * as Auth from './authentication';

import type { LoginStatus } from './authentication';
import { type Subscription } from './types/pubSub';

// -----------------------------------------------------------------------------
//
// LOCAL STATE
//
// -----------------------------------------------------------------------------

let loginChangeSubscription: ?Subscription = null;
let coreEventCallbacks: Array<CoreEventCallback> = [];

// -----------------------------------------------------------------------------
//
// LIFECYCLE
//
// -----------------------------------------------------------------------------

function initialize(): void {
  loginChangeSubscription = Auth.onLoginStatusChanged((status: LoginStatus) => {
    const event = { type: 'LOGIN_STATUS_CHANGE', status };
    coreEventCallbacks.forEach(callback => callback(event));
  });

  Auth.initialize();
}

function destroy(): void {
  Auth.destroy();

  if (loginChangeSubscription) {
    loginChangeSubscription.remove();
    loginChangeSubscription = null;
  }

  // Empty callback listeners. If we decide to initialize again after
  // destroying, we should reset the listeners.
  coreEventCallbacks = [];
}

// -----------------------------------------------------------------------------
//
// SUBSCRIPTION
//
// -----------------------------------------------------------------------------

export type CoreEvent = { type: 'LOGIN_STATUS_CHANGE', status: LoginStatus };
export type CoreEventCallback = (event: CoreEvent) => any;

function onEvent(callback: CoreEventCallback): Subscription {
  coreEventCallbacks.push(callback);
  return {
    remove: () => {
      const index = coreEventCallbacks.indexOf(callback);
      if (index >= 0) {
        coreEventCallbacks.splice(index, 1);
      }
    },
  };
}

export default {
  Auth,

  destroy,
  initialize,
  onEvent,
};
