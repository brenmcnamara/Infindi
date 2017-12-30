/* @flow */

import type { PureAction } from '../typesDEPRECATED/redux';

export type NetworkStatus = 'none' | 'wifi' | 'celular' | 'unknown';

export type State = {
  networkStatus: NetworkStatus,
};

const DEFAULT_STATE: State = {
  networkStatus: 'unknown',
};

export default function network(
  state: State = DEFAULT_STATE,
  action: PureAction,
): State {
  switch (action.type) {
    case 'NETWORK_STATUS_CHANGE': {
      return { ...state, networkStatus: action.status };
    }
  }
  return state;
}
