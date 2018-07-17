/* @flow */

import account from '../data-model/_reducers/Account';
import accountLink from '../data-model/_reducers/AccountLink';
import accountToTransactionCursor from '../life-cycle/reducers/accountToTransactionCursor';
import accountVerification from '../link/reducers/accountVerification';
import actionItems from './actionItems';
import auth from '../auth/reducer';
import configState from './configState';
import modalState from './modalState';
import _provider from '../data-model/_reducers/Provider';
import providers from '../data-model/reducers/providers';
import routeState from './routeState';
import toast from './toast';
import transaction from '../data-model/_reducers/Transaction';
import _userInfo from '../data-model/_reducers/UserInfo';
import userInfo from '../data-model/reducers/userInfo';
import watchSessionState from '../watch-session/reducers/watchSessionState';

import { combineReducers } from 'redux';

import type { State as State$Account } from '../data-model/_reducers/Account';
import type { State as State$AccountLink } from '../data-model/_reducers/AccountLink';
// eslint-disable-next-line max-len
import type { State as State$AccountToTransactionCursor } from '../life-cycle/reducers/accountToTransactionCursor';
import type { State as State$AccountVerification } from '../link/reducers/accountVerification';
import type { State as State$ActionItems } from './actionItems';
import type { State as State$Auth } from '../auth/reducer';
import type { State as State$ConfigState } from './configState';
import type { State as State$ModalState } from './modalState';
import type { State as State$_Provider } from '../data-model/_reducers/Provider';
import type { State as State$Providers } from '../data-model/reducers/providers';
import type { State as State$RouteState } from './routeState';
import type { State as State$Toast } from './toast';
import type { State as State$Transaction } from '../data-model/_reducers/Transaction';
import type { State as State$_UserInfo } from '../data-model/_reducers/UserInfo';
import type { State as State$UserInfo } from '../data-model/reducers/userInfo';
import type { State as State$WatchSession } from '../watch-session/reducers/watchSessionState';

export type State = {|
  +account: State$Account,
  +accountLink: State$AccountLink,
  +accountToTransactionCursor: State$AccountToTransactionCursor,
  +accountVerification: State$AccountVerification,
  +actionItems: State$ActionItems,
  +auth: State$Auth,
  +configState: State$ConfigState,
  +modalState: State$ModalState,
  +_provider: State$_Provider,
  +providers: State$Providers,
  +routeState: State$RouteState,
  +toast: State$Toast,
  +transaction: State$Transaction,
  +_userInfo: State$_UserInfo,
  +userInfo: State$UserInfo,
  +watchSessionState: State$WatchSession,
|};

// TODO: Can I add flow typing here?
export default combineReducers({
  account,
  accountLink,
  actionItems,
  accountToTransactionCursor,
  accountVerification,
  auth,
  configState,
  modalState,
  _provider,
  providers,
  routeState,
  toast,
  transaction,
  _userInfo,
  userInfo,
  watchSessionState,
});
