/* @flow */

import accountLinks from './accountLinks';
import accounts from './accounts';
import accountVerification from '../link/reducers/accountVerification';
import actionItems from './actionItems';
import auth from '../auth/reducer';
import configState from './configState';
import eagleViewState from '../eagle-view/reducers/eagleViewState';
import modalState from './modalState';
import providers from '../data-model/reducers/providers';
import routeState from './routeState';
import toast from './toast';
import transactionLoading from './transactionLoading';
import transactions from './transactions';

import { combineReducers } from 'redux';

import type { State as State$AccountLinks } from './accountLinks';
import type { State as State$Accounts } from './accounts';
import type { State as State$AccountVerification } from '../link/reducers/accountVerification';
import type { State as State$ActionItems } from './actionItems';
import type { State as State$Auth } from '../auth/reducer';
import type { State as State$ConfigState } from './configState';
import type { State as State$EagleView } from '../eagle-view/reducers/eagleViewState';
import type { State as State$ModalState } from './modalState';
import type { State as State$Providers } from '../data-model/reducers/providers';
import type { State as State$RouteState } from './routeState';
import type { State as State$Toast } from './toast';
import type { State as State$TransactionLoading } from './transactionLoading';
import type { State as State$Transactions } from './transactions';

export type State = {|
  +accountLinks: State$AccountLinks,
  +accounts: State$Accounts,
  +accountVerification: State$AccountVerification,
  +actionItems: State$ActionItems,
  +auth: State$Auth,
  +eagleViewState: State$EagleView,
  +configState: State$ConfigState,
  +modalState: State$ModalState,
  +providers: State$Providers,
  +routeState: State$RouteState,
  +toast: State$Toast,
  +transactionLoading: State$TransactionLoading,
  +transactions: State$Transactions,
|};

// TODO: Can I add flow typing here?
export default combineReducers({
  accountLinks,
  actionItems,
  accounts,
  accountVerification,
  auth,
  eagleViewState,
  configState,
  modalState,
  providers,
  routeState,
  toast,
  transactionLoading,
  transactions,
});
