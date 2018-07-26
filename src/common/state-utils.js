/* @flow */

import AccountStateUtils from '../data-model/state-utils/Account';
import AuthStateUtils from '../auth/StateUtils';

import type { Banner } from '../banner/types';
import type { Dollars, ID } from 'common/types/core';
import type { Modal } from '../reducers/modalState';
import type { ReduxState } from '../store';

// -----------------------------------------------------------------------------
//
// QUERY REDUX STATE
//
// -----------------------------------------------------------------------------

export function getActiveUserID(reduxState: ReduxState): ID | null {
  const loginPayload = AuthStateUtils.getLoginPayload(reduxState);
  if (!loginPayload) {
    return null;
  }
  return (
    reduxState.watchSessionState.watchUserID || loginPayload.firebaseUser.uid
  );
}

export function getNetWorth(reduxState: ReduxState): Dollars {
  return AccountStateUtils.getCollection(reduxState).reduce(
    (sum, account) => sum + account.balance,
    0,
  );
}

export function getBanner(reduxState: ReduxState, bannerID: ID): Banner | null {
  return (
    reduxState.banner.bannerQueue.find(banner => banner.id === bannerID) || null
  );
}

export function getModalForID(state: ReduxState, modalID: ID): Modal | null {
  return (
    state.modalState.modalQueue.find(modal => modal.id === modalID) || null
  );
}
