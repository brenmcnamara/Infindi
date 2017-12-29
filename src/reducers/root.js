/* @flow */

import accounts from './accounts';
import authStatus from './authStatus';
import configState from './configState';
import modalState from './modalState';
import navState from './navState';
import plaid from './plaid';

import { combineReducers } from 'redux';

import type { State as State$Accounts } from './accounts';
import type { State as State$AuthStatus } from './authStatus';
import type { State as State$ConfigState } from './configState';
import type { State as State$ModalState } from './modalState';
import type { State as State$NavState } from './navState';
import type { State as State$PlaidState } from './plaid';

export type State = {|
  +accounts: State$Accounts,
  +authStatus: State$AuthStatus,
  +configState: State$ConfigState,
  +modalState: State$ModalState,
  +navState: State$NavState,
  +plaid: State$PlaidState,
|};

// TODO: Can I add flow typing here?
export default combineReducers({
  accounts,
  authStatus,
  configState,
  modalState,
  navState,
  plaid,
});
