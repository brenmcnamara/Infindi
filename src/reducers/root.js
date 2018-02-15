/* @flow */

import accounts from './accounts';
import actionItems from './actionItems';
import authStatus from './authStatus';
import configState from './configState';
import modalState from './modalState';
import network from './network';
// import plaid from './plaid';
import providers from '../yodlee/reducers/providers';
import refreshInfo from './refreshInfo';
import routeState from './routeState';
import toast from './toast';

import { combineReducers } from 'redux';

import type { State as State$Accounts } from './accounts';
import type { State as State$ActionItems } from './actionItems';
import type { State as State$AuthStatus } from './authStatus';
import type { State as State$ConfigState } from './configState';
import type { State as State$ModalState } from './modalState';
import type { State as State$Network } from './network';
// import type { State as State$PlaidState } from './plaid';
import type { State as State$RefreshInfo } from './refreshInfo';
import type { State as State$RouteState } from './routeState';
import type { State as State$Toast } from './toast';
import type { State as State$Providers } from '../yodlee/reducers/providers';

export type State = {|
  +accounts: State$Accounts,
  +actionItems: State$ActionItems,
  +authStatus: State$AuthStatus,
  +configState: State$ConfigState,
  +modalState: State$ModalState,
  +network: State$Network,
  // +plaid: State$PlaidState,
  +providers: State$Providers,
  +refreshInfo: State$RefreshInfo,
  +routeState: State$RouteState,
  +toast: State$Toast,
|};

// TODO: Can I add flow typing here?
export default combineReducers({
  actionItems,
  accounts,
  authStatus,
  configState,
  modalState,
  network,
  // plaid,
  providers,
  refreshInfo,
  routeState,
  toast,
});
