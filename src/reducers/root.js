/* @flow */

import accounts from './accounts';
import authStatus from './authStatus';
import navState from './navState';

import { combineReducers } from 'redux';

import type { State as State$Accounts } from './accounts';
import type { State as State$AuthStatus } from './authStatus';
import type { State as State$NavState } from './navState';

export type State = {|
  +accounts: State$Accounts,
  +authStatus: State$AuthStatus,
  +navState: State$NavState,
|};

// TODO: Can I add flow typing here?
export default combineReducers({ accounts, authStatus, navState });
