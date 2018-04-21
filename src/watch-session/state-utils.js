/* @flow */

import type { ReduxState } from '../typesDEPRECATED/redux';

function getIsInWatchSession(state: ReduxState): boolean {
  return Boolean(state.watchSessionState.watchUserID);
}

export default {
  getIsInWatchSession,
};
