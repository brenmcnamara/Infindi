/* @flow */

import type { ReduxState } from '../store';

function getIsInWatchSession(state: ReduxState): boolean {
  return Boolean(state.watchSessionState.watchUserID);
}

export default {
  getIsInWatchSession,
};
