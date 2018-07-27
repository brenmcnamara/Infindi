/* @flow */

import account from '../data-model/reducers/Account';
import accountLink from '../data-model/reducers/AccountLink';
import accountToTransactionCursor from '../life-cycle/reducers/accountToTransactionCursor';
import accountVerification from '../link/reducers/accountVerification';
import actionItems from '../action-items/Reducer';
import auth from '../auth/reducer';
import banner from '../banner/Reducer';
import provider from '../data-model/reducers/Provider';
import providerFuzzySearch from '../data-model/reducers/ProviderFuzzySearch';
import modal from '../modal/Reducer';
import navigation from '../navigation/Reducer';
import settings from '../settings/Reducer';
import transaction from '../data-model/reducers/Transaction';
import userInfo from '../data-model/reducers/UserInfo';
import watchSessionState from '../watch-session/reducers/watchSessionState';

import { combineReducers } from 'redux';

import type { State as State$Account } from '../data-model/reducers/Account';
import type { State as State$AccountLink } from '../data-model/reducers/AccountLink';
// eslint-disable-next-line max-len
import type { State as State$AccountToTransactionCursor } from '../life-cycle/reducers/accountToTransactionCursor';
import type { State as State$AccountVerification } from '../link/reducers/accountVerification';
import type { State as State$ActionItems } from '../action-items/Reducer';
import type { State as State$Auth } from '../auth/reducer';
import type { State as State$Banner } from '../banner/Reducer';
import type { State as State$Modal } from '../modal/Reducer';
import type { State as State$Navigation } from '../navigation/Reducer';
import type { State as State$Provider } from '../data-model/reducers/Provider';
// eslint-disable-next-line max-len
import type { State as State$ProviderFuzzySearch } from '../data-model/reducers/ProviderFuzzySearch';
import type { State as State$Settings } from '../settings/Reducer';
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
  +banner: State$Banner,
  +modal: State$Modal,
  +navigation: State$Navigation,
  +provider: State$Provider,
  +providerFuzzySearch: State$ProviderFuzzySearch,
  +settings: State$Settings,
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
  banner,
  modal,
  navigation,
  provider,
  providerFuzzySearch,
  settings,
  transaction,
  userInfo,
  watchSessionState,
});
