/* @flow */

import type {ID} from 'common/types/core';

export type Action = Action$EnterWatchSession | Action$ExitWatchSession;

type Action$EnterWatchSession = {|
  +type: 'ENTER_WATCH_SESSION',
  +userID: ID,
|};

function enterWatchSession(userID: ID) {
  return {
    type: 'ENTER_WATCH_SESSION',
    userID,
  };
}

type Action$ExitWatchSession = {|
  +type: 'EXIT_WATCH_SESSION',
|};

function exitWatchSession() {
  return {
    type: 'EXIT_WATCH_SESSION',
  };
}

export default {
  enterWatchSession,
  exitWatchSession,
};
