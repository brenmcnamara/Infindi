/* @flow */

import accounts from './accounts';
import authStatus from './authStatus';
import navState from './navState';
import plaid from './plaid';

import { combineReducers } from 'redux';

import type { State as State$Accounts } from './accounts';
import type { State as State$AuthStatus } from './authStatus';
import type { State as State$NavState } from './navState';
import type { State as State$PlaidState } from './plaid';

export type State = {|
  +accounts: State$Accounts,
  +authStatus: State$AuthStatus,
  +navState: State$NavState,
  +plaid: State$PlaidState,
|};

// TODO: Can I add flow typing here?
export default combineReducers({ accounts, authStatus, navState, plaid });
