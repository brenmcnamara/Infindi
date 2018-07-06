/* @flow */

import _accountLink from '../data-model/_reducers/AccountLink';
import accountLinks from '../data-model/reducers/accountLinks';
import _account from '../data-model/_reducers/Account';
import accounts from '../data-model/reducers/accounts';
import accountVerification from '../link/reducers/accountVerification';
import actionItems from './actionItems';
import auth from '../auth/reducer';
import configState from './configState';
import modalState from './modalState';
import _provider from '../data-model/_reducers/Provider';
import providers from '../data-model/reducers/providers';
import routeState from './routeState';
import toast from './toast';
import transactionLoading from '../data-model/reducers/transactionLoading';
import _transaction from '../data-model/_reducers/Transaction';
import transactions from '../data-model/reducers/transactions';
import _userInfo from '../data-model/_reducers/UserInfo';
import userInfo from '../data-model/reducers/userInfo';
import watchSessionState from '../watch-session/reducers/watchSessionState';

import { combineReducers } from 'redux';

import type { State as State$_AccountLink } from '../data-model/_reducers/AccountLink';
import type { State as State$AccountLinks } from '../data-model/reducers/accountLinks';
import type { State as State$Accounts } from '../data-model/reducers/accounts';
import type { State as State$_Account } from '../data-model/_reducers/Account';
import type { State as State$AccountVerification } from '../link/reducers/accountVerification';
import type { State as State$ActionItems } from './actionItems';
import type { State as State$Auth } from '../auth/reducer';
import type { State as State$ConfigState } from './configState';
import type { State as State$ModalState } from './modalState';
import type { State as State$_Provider } from '../data-model/_reducers/Provider';
import type { State as State$Providers } from '../data-model/reducers/providers';
import type { State as State$RouteState } from './routeState';
import type { State as State$Toast } from './toast';
import type { State as State$TransactionLoading } from '../data-model/reducers/transactionLoading';
import type { State as State$_Transaction } from '../data-model/_reducers/Transaction';
import type { State as State$Transactions } from '../data-model/reducers/transactions';
import type { State as State$_UserInfo } from '../data-model/_reducers/UserInfo';
import type { State as State$UserInfo } from '../data-model/reducers/userInfo';
import type { State as State$WatchSession } from '../watch-session/reducers/watchSessionState';

export type State = {|
  +_accountLink: State$_AccountLink,
  +accountLinks: State$AccountLinks,
  +_account: State$_Account,
  +accounts: State$Accounts,
  +accountVerification: State$AccountVerification,
  +actionItems: State$ActionItems,
  +auth: State$Auth,
  +configState: State$ConfigState,
  +modalState: State$ModalState,
  +_provider: State$_Provider,
  +providers: State$Providers,
  +routeState: State$RouteState,
  +toast: State$Toast,
  +transactionLoading: State$TransactionLoading,
  +_transaction: State$_Transaction,
  +transactions: State$Transactions,
  +_userInfo: State$_UserInfo,
  +userInfo: State$UserInfo,
  +watchSessionState: State$WatchSession,
|};

// TODO: Can I add flow typing here?
export default combineReducers({
  _accountLink,
  accountLinks,
  actionItems,
  _account,
  accounts,
  accountVerification,
  auth,
  configState,
  modalState,
  _provider,
  providers,
  routeState,
  toast,
  transactionLoading,
  _transaction,
  transactions,
  _userInfo,
  userInfo,
  watchSessionState,
});
