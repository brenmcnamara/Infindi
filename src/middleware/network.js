/* @flow */

import { NetInfo } from 'react-native';

import type { Next, PureAction, Store } from '../typesDEPRECATED/redux';
import type { NetworkStatus } from '../reducers/network';

export type Action = Action$NetworkStatusChange;

type Action$NetworkStatusChange = {|
  +status: NetworkStatus,
  +type: 'NETWORK_STATUS_CHANGE',
|};

/**
 * This middleware is used to keep track of network connectivity. It will
 * keep track of whether the user is connected to the internet and will allow
 * different parts of the app to register network requests.
 */
export default (store: Store) => (next: Next) => {
  let networkStatus: NetworkStatus = 'unknown';

  // NOTE: This does not work well on simulator.
  NetInfo.addEventListener('connectionChange', onConnectionChange);

  function onConnectionChange(info: { type: NetworkStatus }): void {
    const newNetworkStatus = info.type;
    if (newNetworkStatus !== networkStatus) {
      networkStatus = info.type;
      next({
        status: networkStatus,
        type: 'NETWORK_STATUS_CHANGE',
      });
    }
  }

  return (action: PureAction) => {
    next(action);
    const currentRequests = {};

    // TODO: Would like to use this module to eventually monitor network
    // requests. As of now, this is not needed.
    switch (action.type) {
      case 'NETWORK_REQUEST_START': {
        currentRequests[action.requestID] = true;
        break;
      }

      case 'NETWORK_REQUEST_SUCCESS': {
        delete currentRequests[action.requestID];
        break;
      }

      case 'NETWORK_REQUEST_FAILURE': {
        delete currentRequests[action.requestID];
        break;
      }
    }
  };
};
