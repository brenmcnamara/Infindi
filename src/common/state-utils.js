/* @flow */

import invariant from 'invariant';

import { getBalance } from 'common/lib/models/Account';
import { getLoginPayload } from '../auth/state-utils';

import type { Dollars, ID } from 'common/types/core';
import type { Modal } from '../reducers/modalState';
import type { ReduxState } from '../store';
import type { Toast } from '../reducers/toast';

// -----------------------------------------------------------------------------
//
// QUERY REDUX STATE
//
// -----------------------------------------------------------------------------

export function getActiveUserID(state: ReduxState): ID | null {
  const loginPayload = getLoginPayload(state);
  if (!loginPayload) {
    return null;
  }
  return state.watchSessionState.watchUserID || loginPayload.firebaseUser.uid;
}

export function getNetWorth(state: ReduxState): Dollars {
  const { accounts } = state;
  switch (accounts.type) {
    case 'DOWNLOADING':
    case 'DOWNLOAD_FAILED':
    case 'EMPTY': {
      return 0;
    }

    case 'STEADY': {
      const { container } = accounts;
      let total = 0;
      for (const id in container) {
        if (container.hasOwnProperty(id)) {
          total += getBalance(container[id]);
        }
      }
      return total;
    }

    default:
      return invariant(false, 'Unrecognized account type %s', accounts.type);
  }
}

export function getToast(state: ReduxState, toastID: ID): Toast | null {
  return state.toast.bannerQueue.find(banner => banner.id === toastID) || null;
}

export function getModalForID(state: ReduxState, modalID: ID): Modal | null {
  return (
    state.modalState.modalQueue.find(modal => modal.id === modalID) || null
  );
}
