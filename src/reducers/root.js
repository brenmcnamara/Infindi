/* @flow */

import account from '../data-model/reducers/Account';
import accountLink from '../data-model/reducers/AccountLink';
import accountToTransactionCursor from '../life-cycle/reducers/accountToTransactionCursor';
import accountVerification from '../link/reducers/accountVerification';
import actionItems from './actionItems';
import auth from '../auth/reducer';
import configState from './configState';
import modalState from './modalState';
import provider from '../data-model/reducers/Provider';
import providerFuzzySearch from '../data-model/reducers/ProviderFuzzySearch';
import routeState from './routeState';
import toast from './toast';
import transaction from '../data-model/reducers/Transaction';
import userInfo from '../data-model/reducers/UserInfo';
import watchSessionState from '../watch-session/reducers/watchSessionState';

import { combineReducers } from 'redux';

import type { State as State$Account } from '../data-model/reducers/Account';
import type { State as State$AccountLink } from '../data-model/reducers/AccountLink';
// eslint-disable-next-line max-len
import type { State as State$AccountToTransactionCursor } from '../life-cycle/reducers/accountToTransactionCursor';
import type { State as State$AccountVerification } from '../link/reducers/accountVerification';
import type { State as State$ActionItems } from './actionItems';
import type { State as State$Auth } from '../auth/reducer';
import type { State as State$ConfigState } from './configState';
import type { State as State$ModalState } from './modalState';
import type { State as State$Provider } from '../data-model/reducers/Provider';
// eslint-disable-next-line max-len
import type { State as State$ProviderFuzzySearch } from '../data-model/reducers/ProviderFuzzySearch';
import type { State as State$RouteState } from './routeState';
import type { State as State$Toast } from './toast';
import type { State as State$Transaction } from '../data-model/reducers/Transaction';
import type { State as State$UserInfo } from '../data-model/reducers/UserInfo';
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
  +provider: State$Provider,
  +providerFuzzySearch: State$ProviderFuzzySearch,
  +routeState: State$RouteState,
  +toast: State$Toast,
  +transaction: State$Transaction,
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
  provider,
  providerFuzzySearch,
  routeState,
  toast,
  transaction,
  userInfo,
  watchSessionState,
});
