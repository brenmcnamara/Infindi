/* @flow */

import AccountStateUtils from '../data-model/_state-utils/Account';

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

export function getNetWorth(reduxState: ReduxState): Dollars {
  return AccountStateUtils.getCollection(reduxState).reduce(
    (sum, account) => sum + account.balance,
    0,
  );
}

export function getToast(state: ReduxState, toastID: ID): Toast | null {
  return state.toast.bannerQueue.find(banner => banner.id === toastID) || null;
}

export function getModalForID(state: ReduxState, modalID: ID): Modal | null {
  return (
    state.modalState.modalQueue.find(modal => modal.id === modalID) || null
  );
}
